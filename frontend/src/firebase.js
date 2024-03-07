// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "signup-signin-4298c.firebaseapp.com",
  projectId: "signup-signin-4298c",
  storageBucket: "signup-signin-4298c.appspot.com",
  messagingSenderId: "484703148247",
  appId: "1:484703148247:web:ce62d8f58fc99cbcb33892",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
