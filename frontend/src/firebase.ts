import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";

// TODO: Replace these with your actual Firebase project config
// 1. Go to console.firebase.google.com
// 2. Create a project and add a Web App
// 3. Copy the config values here:
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface BillMetadata {
  name: string;
  description: string;
  currency?: 'XLM' | 'USDC';
  createdAt?: string;
}

// Helper functions for KlassPay
export const saveBillMetadata = async (
  billId: number,
  name: string,
  description: string,
  currency: 'XLM' | 'USDC' = 'XLM'
): Promise<void> => {
  try {
    await setDoc(doc(db, "bills", billId.toString()), {
      name,
      description,
      currency,
      createdAt: new Date().toISOString()
    });
  } catch (e) {
    console.error("Error saving bill metadata:", e);
  }
};

export const getBillMetadata = async (billId: number): Promise<BillMetadata | null> => {
  try {
    const docRef = doc(db, "bills", billId.toString());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as BillMetadata;
    }
  } catch (e) {
    console.error("Error fetching bill metadata:", e);
  }
  return null;
};

export const getAllBillsMetadata = async (): Promise<Array<{ id: number; metadata: BillMetadata }>> => {
  try {
    const querySnapshot = await getDocs(collection(db, "bills"));
    const results: Array<{ id: number; metadata: BillMetadata }> = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as BillMetadata;
      const id = parseInt(docSnap.id, 10);
      if (!isNaN(id)) {
        results.push({ id, metadata: data });
      }
    });
    return results;
  } catch (e) {
    console.error("Error fetching all bills metadata:", e);
    return [];
  }
};
