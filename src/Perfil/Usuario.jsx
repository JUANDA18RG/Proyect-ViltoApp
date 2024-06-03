import { useAuth } from "../context/authContext";
import ActividadUsuario from "./ActividadUsuario";
import ProyectosRecientesUsuario from "./ProyectosRecientesUsuario";
import userImage from "/assets/user.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Perfil/Spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Usuario() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [CargaSkeleton, setCargaSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCargaSkeleton(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  const devolver = () => {
    window.history.back();
  };

  if (loading) {
    // Si está cargando, renderizamos el componente de carga
    return <Spinner />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full h-screen animate-fade-right overflow-hidden">
      <div
        className={`w-full md:w-1/3 flex flex-col items-center justify-center p-8 ${
          darkMode
            ? "bg-gradient-to-t from-gray-800 to-gray-900"
            : "bg-gradient-to-t from-gray-200 to-white"
        }`}
      >
        {CargaSkeleton ? (
          <div className="absolute top-4 left-4">
            <SkeletonTheme
              baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
              highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
            >
              <Skeleton circle={true} width={50} height={50} />
            </SkeletonTheme>
          </div>
        ) : (
          <button
            onClick={devolver}
            className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-full shadow-md hover:animate-jump"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}
        {CargaSkeleton ? (
          <SkeletonTheme
            baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
            highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
          >
            <Skeleton circle={true} height={144} width={144} />
            <Skeleton width={200} height={20} />
          </SkeletonTheme>
        ) : (
          user && (
            <div className="text-center mb-6 ">
              <div className="">
                <img
                  src={user.photoURL ? user.photoURL : userImage}
                  alt={user.displayName}
                  className={`w-36 h-36 rounded-full mx-auto mb-4  shadow-md animate-jump-in p-1 ${
                    darkMode
                      ? "border-2 border-red-500"
                      : "border-2 border-red-500"
                  }`}
                />
              </div>
              <p
                className={`text-xl font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {user.displayName}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {user.email}
              </p>
            </div>
          )
        )}
        {CargaSkeleton ? (
          <SkeletonTheme
            baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
            highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
          >
            <Skeleton width={200} height={50} radius={25} />
          </SkeletonTheme>
        ) : (
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-md mb-6 hover:animate-jump">
            Gestionar Cuenta
          </button>
        )}
      </div>

      {user && (
        <div
          className={`w-2/3 flex flex-col overflow-y-auto ${
            darkMode ? "bg-gray-600" : "bg-gradient-to-b from-gray-200 to-white"
          }`}
        >
          {CargaSkeleton ? (
            <div className="flex justify-center items-center m-8">
              <SkeletonTheme
                baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
                highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
              >
                <Skeleton width={700} height={300} />
              </SkeletonTheme>
            </div>
          ) : (
            <ProyectosRecientesUsuario />
          )}
          {CargaSkeleton ? (
            <div className="flex justify-center items-center">
              <SkeletonTheme
                baseColor={darkMode ? "#3D4451" : "#D0D0D0"}
                highlightColor={darkMode ? "#5A6270" : "#C0C0C0"}
              >
                <Skeleton width={700} height={300} />
              </SkeletonTheme>
            </div>
          ) : (
            <ActividadUsuario />
          )}
        </div>
      )}
    </div>
  );
}
