import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi7Xpst7QlLKo8ZxAmeigSydk1RDTgEwU",
  authDomain: "gen-lang-client-0896049850.firebaseapp.com",
  projectId: "gen-lang-client-0896049850",
  storageBucket: "gen-lang-client-0896049850.firebasestorage.app",
  messagingSenderId: "278100521992",
  appId: "1:278100521992:web:992b30524d77968bb10dbd",
  measurementId: "G-4Y5KE8DLF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);