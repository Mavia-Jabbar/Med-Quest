import { db } from "@/Context/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react';

// Converts ugly Google Drive 'view?usp=sharing' link to a native iframe 'preview' link
export const formatGoogleDriveLink = (url) => {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

// Push new material to database
export const uploadMaterial = async (materialData) => {
  try {
    const formattedUrl = formatGoogleDriveLink(materialData.url);
    const docRef = await addDoc(collection(db, "materials"), {
      ...materialData,
      url: formattedUrl,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Instantly delete material from Cloud Database
export const deleteMaterial = async (id) => {
  try {
    await deleteDoc(doc(db, "materials", id));
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Hook for StudyMaterials to fetch live database
export const useMaterialsList = () => {
  const [materialsList, setMaterialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Order by oldest or newest depending on structure
    const q = query(collection(db, "materials"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterialsList(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { materialsList, loading };
};
