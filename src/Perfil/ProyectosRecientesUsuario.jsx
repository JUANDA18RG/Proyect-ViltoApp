import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import io from "socket.io-client";
import { useAuth } from "../context/authContext";

export default function VisitasUsuario() {
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

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
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("obtenerAcciones", { userEmail: user.email });

    socket.on("conteoFechas", (conteoFechas) => {
      const data = Object.entries(conteoFechas).map(([name, visitas]) => ({
        name,
        Acciones: visitas,
      }));
      setData(data);
      console.log(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      className={`flex justify-center items-center m-8 ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full p-8 shadow-lg rounded-lg ${
          darkMode
            ? "bg-gray-800 border-2 border-gray-700"
            : "bg-white border-2 border-gray-300"
        }`}
      >
        <h2
          className={`text-lg font-bold mb-7 text-center items-center ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          General User Movements
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f56565" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ed64a6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="Acciones"
              stroke="#ed64a6" // Cambia este valor al color que desees
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
