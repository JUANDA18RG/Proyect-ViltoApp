import { Routes, Route } from "react-router-dom";
import SignUp from "./login/sign-up";
import SignIn from "./login/sign-in";
import Portada from "./login/Portada";
import { AuthProvider } from "./context/authContext";
import PageInit from "./Home/pageInit";
import Usuario from "./Perfil/Usuario";
import AreaTrabajo from "./Components/AraTrabajo";
import { useState, useEffect } from "react";
import Spinner from "./Perfil/Spinner";
import socket from "./Sockets";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al servidor");
    });
    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });
  }, []);

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  ) : (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/PageInit" element={<PageInit />} />
        <Route path="/AreaTrabajo/:id" element={<AreaTrabajo />} />
        <Route path="/Usuario" element={<Usuario />} />
        <Route path="*" element={<Portada />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
