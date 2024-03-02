import { useState } from "react";
import { useAuth } from "../context/authContext";

export default function ZonaCrearProyectos() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const auth = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userEmail = auth.user.email;

    const project = {
      name,
      description,
      users: [{ email: userEmail }],
    };

    const response = await fetch("http://localhost:4000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del proyecto"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción del proyecto"
          required
        />
        <button type="submit">Agregar proyecto</button>
      </form>
    </div>
  );
}
