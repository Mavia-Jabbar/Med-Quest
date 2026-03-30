import { db } from "@/Context/firebase";
import { doc, setDoc, increment, collection, onSnapshot } from "firebase/firestore";
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
