import { auth } from "../firebase/firebase.config";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GithubAuthProvider,
} from "firebase/auth";
import PropTypes from "prop-types";
import { uploadFile } from "../firebase/firebase.config";
import io from "socket.io-client";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del proveedor AuthContext");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Cuando se obtiene el estado del usuario, se establece la carga en false
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password, name) => {
    try {
      if (!email || !password || !name) {
        throw new Error("Todos los campos son obligatorios");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      setUser(user);
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Por favor, completa todos los campos");
      }

      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;

      await fetchUserData(user);

      setUser(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  const socket = io("http://localhost:3000");
  const fetchUserData = (user) => {
    socket.emit("crearUsuario", {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
    });
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await fetchUserData(user);
      setUser(user);
      let blob;
      try {
        const imageResponse = await fetch(user.photoURL);
        blob = await imageResponse.blob();
      } catch (error) {
        console.error("Error al descargar la imagen de perfil:", error);
        return;
      }
      try {
        await uploadFile(blob, user.email);
      } catch (error) {
        console.error(
          "Error al subir la imagen de perfil a Firebase Storage:",
          error
        );
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await fetchUserData(user);
      setUser(user);

      // Descargar la imagen de perfil como un Blob
      let blob;
      try {
        const imageResponse = await fetch(user.photoURL);
        blob = await imageResponse.blob();
      } catch (error) {
        console.error("Error al descargar la imagen de perfil:", error);
        return;
      }

      // Subir el Blob al storage de Firebase
      try {
        await uploadFile(blob, user.email);
      } catch (error) {
        console.error(
          "Error al subir la imagen de perfil a Firebase Storage:",
          error
        );
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Github:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <authContext.Provider
      value={{
        register,
        login,
        loginWithGoogle,
        logout,
        user,
        loginWithGithub,
        loading,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
