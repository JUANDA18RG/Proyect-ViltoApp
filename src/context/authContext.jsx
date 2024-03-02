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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // No es necesario retornar una función de limpieza aquí

    return () => unsubscribe();
  }, []);

  const register = async (email, password, name) => {
    try {
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
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        }),
      });
      setUser(user);
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        }),
      });
      setUser(user);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  const loginWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        }),
      });
      setUser(user);
    } catch (error) {
      console.error("Error al iniciar sesión con Github:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
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
      }}
    >
      {children}
    </authContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
