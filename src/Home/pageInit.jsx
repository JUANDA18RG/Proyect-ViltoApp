import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarPage from "./NavbarPage";
import Menu from "./Menu";
import Favorites from "./Favorites";
import Miembros from "./Miembros";
import { useAuth } from "../context/authContext";
import Spinner from "../Perfil/Spinner";
import Works from "./works";

export default function PageInit() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("projects"); // Inicialmente, muestra los proyectos

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isEnabled = JSON.parse(saved) || false;
    setDarkMode(isEnabled);

    const handleDarkModeChange = () => {
      const saved = localStorage.getItem("darkMode");
      const isEnabled = JSON.parse(saved) || false;
      setDarkMode(isEnabled);
    };

    window.addEventListener("darkModeChange", handleDarkModeChange);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("darkModeChange", handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      // Solo redirigimos a /404 si la carga ha terminado y no hay usuario
      navigate("/404");
    }
  }, [user, navigate, loading]); // Agregamos loading a las dependencias del useEffect

  if (loading) {
    // Si está cargando, renderizamos el componente de carga
    return <Spinner />;
  }

  // Función para renderizar el componente correspondiente según la opción seleccionada
  const renderSelectedComponent = () => {
    switch (selectedMenuItem) {
      case "projects":
        return <Works />;
      case "favorites":
        return <Favorites />;
      case "members":
        return <Miembros />;
      default:
        return <Works />;
    }
  };

  return (
    <div
      className={`bg-gradient-to-t ${
        darkMode ? "from-gray-800 to-gray-900" : "from-gray-300 to-white"
      } animate-fade-right overflow-hidden h-screen`}
    >
      <div className="bg-transparent">
        <NavbarPage />
        <div className="flex">
          <Menu onMenuItemChange={setSelectedMenuItem} />

          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
}
