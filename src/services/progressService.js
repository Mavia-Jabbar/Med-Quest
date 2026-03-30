import { db } from "@/Context/firebase";
import { doc, setDoc, increment, collection, onSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

// Track when a user reads a PDF or flips a flashcard (Raw Point System)
export const trackSubjectProgress = async (userId, subject, pointsToAdd = 1) => {
  if (!userId) return;
  const progressRef = doc(db, "users", userId, "progress", subject);
  
  try {
    await setDoc(progressRef, {
      score: increment(pointsToAdd),
      lastStudied: new Date().toISOString()
    }, { merge: true });
    await updateStreak(userId);
  } catch (error) {
    console.error("Failed to track subject progress:", error);
  }
};

// Phase 3 Endpoint: Hard-codes the Mastery Score based on the Mock Test percentage, capping out exactly at 100%
export const updateSubjectMastery = async (userId, subject, percentageScore) => {
  if (!userId) return;
  const progressRef = doc(db, "users", userId, "progress", subject);
  
  try {
    // We only update if 'percentageScore' is higher than their previous stored score to prevent Gamification regression.
    const snap = await getDoc(progressRef);
    let newScore = percentageScore;

    if (snap.exists()) {
       const existingScore = snap.data().score || 0;
       if (existingScore >= percentageScore) {
         // They already got a higher score before, just update the timestamp
         newScore = existingScore; 
       }
    }

    await setDoc(progressRef, {
      score: newScore,
      lastStudied: new Date().toISOString(),
      lastExamDate: new Date().toLocaleDateString('en-CA')
    }, { merge: true });

    await updateStreak(userId);
  } catch (error) {
    console.error("Failed to update subject mastery:", error);
  }
};

// Hook for Dashboard to listen to real-time progress updates
export const useSubjectProgress = (userId) => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    if (!userId) return;
    
    const progressCollectionRef = collection(db, "users", userId, "progress");
    const unsubscribe = onSnapshot(progressCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        subject: doc.id,
        ...doc.data()
      }));
      setProgressData(data);
    });

    return () => unsubscribe();
  }, [userId]);

  return progressData;
};

// Internal algorithm to update Study Streak
const updateStreak = async (userId) => {
  const streakRef = doc(db, "users", userId, "streak", "data");
  const streakSnap = await getDoc(streakRef);
  
  // Format Date in local timezone specifically to track "days"
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
  
  if (!streakSnap.exists()) {
    await setDoc(streakRef, {
      currentStreak: 1,
      lastStudiedDate: today
    });
    return;
  }
  
  const data = streakSnap.data();
  const lastDate = data.lastStudiedDate;
  
  // Already studied today
  if (lastDate === today) return; 
  
  // Calculate day difference
  const lastDateObj = new Date(lastDate);
  const todayObj = new Date(today);
  const diffTime = Math.abs(todayObj - lastDateObj);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    // Studied yesterday, streak continues!
    await setDoc(streakRef, {
        currentStreak: increment(1),
        lastStudiedDate: today
    }, { merge: true });
  } else if (diffDays > 1) {
    // Missed a day, streak resets.
    await setDoc(streakRef, {
        currentStreak: 1,
        lastStudiedDate: today
    });
  }
};

// Hook for Dashboard to get dynamic Streak Value
export const useStreak = (userId) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!userId) return;
    
    const streakRef = doc(db, "users", userId, "streak", "data");
    const unsubscribe = onSnapshot(streakRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const today = new Date().toLocaleDateString('en-CA');
        
        const lastDate = data.lastStudiedDate;
        if (!lastDate) return;
        
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffTime = Math.abs(todayObj - lastDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If they missed yesterday, the streak is functionally broken until they study again.
        if (diffDays <= 1) {
          setStreak(data.currentStreak);
        } else {
          setStreak(0);
        }
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return streak;
};
