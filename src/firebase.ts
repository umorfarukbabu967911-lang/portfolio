import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID if provided, otherwise default
const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { db };

// Helper to get portfolio data from Firestore
export async function getPortfolioData(): Promise<any> {
  try {
    const docRef = doc(db, "portfolio", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching portfolio data from Firestore:", error);
    throw error;
  }
}

// Helper to save portfolio data to Firestore
export async function savePortfolioData(data: any): Promise<void> {
  try {
    const docRef = doc(db, "portfolio", "main");
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error saving portfolio data to Firestore:", error);
    throw error;
  }
}
