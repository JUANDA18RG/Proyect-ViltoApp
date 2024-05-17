import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white relative  animate-fade-right">
      <div
        className="absolute inset-0 bg-bottom bg-no-repeat bg-cover transform rotate-180 opacity-60"
        style={{ backgroundImage: `url('../../assets/wavesOpacity.svg')` }}
      ></div>
      <h1 className="text-9xl font-bold z-10 bg-gray-800 bg-opacity-50 px-4 py-2 rounded-md shadow-lg animate-jump-in">
        404
      </h1>
      <h2 className="text-2xl font-semibold mt-4 z-10 bg-gray-800 bg-opacity-50 px-4 py-2 rounded-md shadow-lg animate-jump-in">
        No tienes permiso para seguir, lo sentimos
      </h2>
      <Link
        to="/"
        className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md shadow-lg text-white hover:animate-jump z-10 mt-5 p-3 text-lg transition duration-200 ease-in-out transform hover:scale-105"
      >
        Ir a la página de inicio
      </Link>
    </div>
  );
}
