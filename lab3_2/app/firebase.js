import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLXNiUrYRPJvvlyPHBVjpewk0yn_TL8rQ",
  authDomain: "bookstor3.firebaseapp.com",
  projectId: "bookstor3",
  storageBucket: "bookstor3.firebasestorage.app",
  messagingSenderId: "298571886875",
  appId: "1:298571886875:web:8c8ed7cd08a91f4c72e3be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();