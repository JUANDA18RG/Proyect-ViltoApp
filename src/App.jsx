import { Routes, Route } from "react-router-dom";
import SignUp from "./login/sign-up";
import SignIn from "./login/sign-in";
import Portada from "./login/Portada";
import { AuthProvider } from "./context/authContext";
import PageInit from "./Home/pageInit";
import Usuario from "./Perfil/Usuario";
import AreaTrabajo from "./Components/AraTrabajo";
import { useState, useEffect, createContext, useContext } from "react";
import Spinner from "./Perfil/Spinner";
import { io } from "socket.io-client";

const SocketContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  ) : (
    <SocketContext.Provider value={socket}>
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
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export default App;
