import { useAuth } from "../Context/AuthContext";
import ActividadUsuario from "./ActividadUsuario";
import ProyectosRecientesUsuario from "./ProyectosRecientesUsuario";

export default function Usuario() {
  const auth = useAuth();
  const devolver = () => {
    window.history.back();
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 flex flex-col items-center justify-center p-8">
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
        <div className="text-center mb-6">
          <img
            src={auth.user.photoURL}
            alt={auth.user.displayName}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-red-500"
          />
          <p className="text-xl font-semibold">{auth.user.displayName}</p>
          <p className="text-gray-500 text-sm">{auth.user.email}</p>
        </div>
        <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-md mb-6 hover:animate-jump">
          Gestionar Cuenta
        </button>
      </div>
      <div className="w-2/3 bg-gray-100">
        <ProyectosRecientesUsuario />
        <ActividadUsuario />
      </div>
    </div>
  );
}
