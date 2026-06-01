import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7wfKsaVUnYzoHyLSaxnktJLZQH2sKqu8",
  authDomain: "saferoute-quantum-quads.firebaseapp.com",
  projectId: "saferoute-quantum-quads",
  storageBucket: "saferoute-quantum-quads.firebasestorage.app",
  messagingSenderId: "424661347697",
  appId: "1:424661347697:web:221f9feeda36fb60f01ad0",
  measurementId: "G-ETHW4Y6X4S"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);