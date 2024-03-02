import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";
import OpcionesProyects from "../Components/OpcionesProyects";
import GuiaInicio from "../Components/GuiaInicio";
import { useAuth } from "../context/authContext";

export default function Works() {
  const [works, setWorks] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (auth.user) {
        const email = auth.user.email;
        const response = await fetch(`http://localhost:4000/projects/${email}`);
        const data = await response.json();
        setWorks(data);
        console.log(data);
      }
    };

    fetchProjects();
  }, [auth.user]);
  return (
    <div className="w-4/5 h-screen overflow-y-auto mt-8 pb-20">
      <div className="flex flex-col px-4 md:px-20">
        <div className="flex py-8 md:px-14 px-10 text-sm md:text-xl justify-between">
          <div className="flex m-2">
            <ButtonAdd />
          </div>
          <GuiaInicio />
        </div>
        <div className="text-center mt-2">
          <div className="text-center w-full">
            <div className="flex flex-wrap justify-center  items-center m-5 gap-x-10">
              {works.map((work) => (
                <Link to={`/AreaTrabajo`} key={work._id}>
                  <div
                    key={work._id}
                    className="relative flex flex-col items-center justify-center w-64 h-60 m-5 rounded-lg bg-gray-100"
                  >
                    <div className="absolute top-2 right-2">
                      <OpcionesProyects />
                    </div>
                    <h1 className="text-2xl font-bold">{work.name}</h1>
                    <p className="text-lg">{work.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
