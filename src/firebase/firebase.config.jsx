import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjFih-4K8LxFOgA6VbE81k5rJClt61JBA",
  authDomain: "viltoappproyect.firebaseapp.com",
  projectId: "viltoappproyect",
  storageBucket: "viltoappproyect.appspot.com",
  messagingSenderId: "328721418700",
  appId: "1:328721418700:web:b1a676bef38a143252b569",
  measurementId: "G-3WTR6D2EB9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
const storage = getStorage(app);

console.log(analytics);

export function uploadFile(file, fileName) {
  const storageRef = ref(storage, `profileImages/${fileName}`);
  uploadBytes(storageRef, file)
    .then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
}

export function obtenerUrlImagen(nombreUsuario) {
  const imagenRef = ref(storage, `profileImages/${nombreUsuario}`);
  return getDownloadURL(imagenRef);
}
