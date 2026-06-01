import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: YOUR_API_KEY,
  authDomain: YOUR_DOMAIN_AUTHORIZATION,
  projectId: YOUR_PROJECT_ID,
  storageBucket: YOUR_STORAGE_BUCKET_LINK,
  messagingSenderId: YOUR_MESSAGE_SENDER_ID,
  appId: YOUR_APP_ID,
  measurementId: YOUR_MEASUREMENTS_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
