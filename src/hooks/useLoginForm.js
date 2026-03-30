import { useState } from "react";
import { useFirebase } from "@/Context/firebase";

export const useLoginForm = () => {
  const { signInUser, signInWithGoogle } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInUser(email, password);
      // Navigation is handled globally by route guarding or AuthRedirect
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError("Failed to log in with Google.");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    error,
    loading,
    showPassword, setShowPassword,
    handleSubmit,
    handleGoogleAuth,
  };
};
