import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";
import OpcionesProyects from "../Components/OpcionesProyects";
import GuiaInicio from "../Components/GuiaInicio";

const works = [
  { id: 1, name: "Proyecto 1", description: "Descripcion del proyecto 1" },
  { id: 2, name: "Proyecto 2", description: "Descripcion del proyecto 2" },
  { id: 3, name: "Proyecto 3", description: "Descripcion del proyecto 3" },
  { id: 4, name: "Proyecto 4", description: "Descripcion del proyecto 4" },
  { id: 5, name: "Proyecto 5", description: "Descripcion del proyecto 5" },
  { id: 6, name: "Proyecto 6", description: "Descripcion del proyecto 6" },
  { id: 7, name: "Proyecto 7", description: "Descripcion del proyecto 7" },
  { id: 8, name: "Proyecto 8", description: "Descripcion del proyecto 8" },
  { id: 9, name: "Proyecto 9", description: "Descripcion del proyecto 9" },
];

export default function Works() {
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
                <Link to={`/AreaTrabajo`} key={work.id}>
                  <div
                    key={work.id}
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
