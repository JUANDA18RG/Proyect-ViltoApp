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
  useEffect(() => {
    const socket = io("http://localhost:3000");
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
    <div className="bg-gray-100 flex justify-center items-center m-8">
      <div className="w-full bg-white shadow-lg  p-8 rounded-lg border-2 border-gray-300">
        <h2 className="text-lg font-bold mb-7 text-center items-center">
          Movimientos Generales del Usuario
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
