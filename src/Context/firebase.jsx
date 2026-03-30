import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
const FirebaseContext = createContext();
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const registerUser = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        plan: "free",
        createdAt: new Date().toISOString(),
      });
      
      return userCredential;
    } catch (error) {
      console.error("Error creating user and Firestore document:", error);
      throw error;
    }
  };

  const signInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  // Add this function (replace your popup version)
  // const signInWithGoogle = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithRedirect(auth, provider);
  //     // The page will reload/redirect – no immediate return value
  //   } catch (error) {
  //     console.error("Google redirect start failed:", error);
  //   }
  // };

  // // Handle the result after redirect (add this in App.jsx or a root-level component)
  // useEffect(() => {
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       if (result?.user) {
  //         console.log(
  //           "Google sign-in success via redirect:",
  //           result.user.email,
  //         );
  //         // Optional: navigate("/dashboard") or show success toast
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Google redirect result error:", error);
  //       // Show error message to user
  //     });
  // }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log("Sign-out successful.");
      // Optional: redirect here if you want global redirect
      window.location.href = "/login";
    } catch (error) {
      console.error("Sign-out failed:", error);
      // Optional: show toast/notification here
      throw error; // if you want calling component to handle error
    }
  };

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user metadata:", error);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  const isLoggedIn = !!user; // converts user → boolean (true/false)

  return (
    <FirebaseContext.Provider
      value={{
        createUser,
        registerUser,
        signInUser,
        signInWithGoogle,
        user,
        userData,
        isLoggedIn,
        loading,
        signOutUser,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
