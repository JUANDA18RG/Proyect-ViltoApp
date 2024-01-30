import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";
import OpcionesProyects from "../Components/OpcionesProyects";

const works = [
  { id: 1, name: "Proyecto 1", description: "Descripcion del proyecto 1" },
  { id: 2, name: "Proyecto 2", description: "Descripcion del proyecto 2" },
  { id: 3, name: "Proyecto 3", description: "Descripcion del proyecto 3" },
  { id: 4, name: "Proyecto 4", description: "Descripcion del proyecto 4" },
];

export default function Works() {
  return (
    <div className="flex flex-col mt-14 px-4 md:px-20">
      <div className="flex mt-10 md:ml-14 ml-10 text-sm md:text-xl">
        <ButtonAdd />
        <p className="text-sm items-center text-center  ml-2 md:ml-5 mt-1 text-gray-400 md:text-lg">
          You have three projects free
        </p>
      </div>

      <div className="text-center mt-5">
        <div className="text-center w-full">
          <div className="flex flex-wrap justify-center mt-10 items-center m-5 gap-x-10">
            {works.map((work) => (
              <Link to={`/SpaceWork`} key={work.id}>
                <div
                  key={work.id}
                  className="relative flex flex-col items-center justify-center w-64 h-64 m-5 rounded-lg bg-gray-100"
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
  );
}
