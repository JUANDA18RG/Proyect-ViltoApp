// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzGAfjmGvN-BuHUTIjO_lqhQk1I_-XILU",
  authDomain: "symbolic-eye-411823.firebaseapp.com",
  projectId: "symbolic-eye-411823",
  storageBucket: "symbolic-eye-411823.appspot.com",
  messagingSenderId: "927368673667",
  appId: "1:927368673667:web:9c600478597a17f1741eb6",
  measurementId: "G-E0LC8P24F2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

console.log(analytics);
