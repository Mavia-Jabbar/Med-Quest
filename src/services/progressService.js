import { db } from "@/Context/firebase";
import { doc, setDoc, increment, collection, onSnapshot, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useEffect, useState } from "react";

// Track when a user reads a PDF or flips a flashcard
export const trackSubjectProgress = async (userId, subject, pointsToAdd = 1) => {
  if (!userId) return;
  // Collection structure: users/{userId}/progress/{subject}
  const progressRef = doc(db, "users", userId, "progress", subject);
  
  try {
    await setDoc(progressRef, {
      score: increment(pointsToAdd),
      lastStudied: new Date().toISOString()
    }, { merge: true });

    // Ensure streak is updated whenever a student studies!
    await updateStreak(userId);

  } catch (error) {
    console.error("Failed to track subject progress:", error);
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
