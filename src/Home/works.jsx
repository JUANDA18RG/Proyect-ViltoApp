import { Link } from "react-router-dom";
import ButtonAdd from "../Components/buttonAdd";

const works = [
  { id: 1, name: "Proyecto 1", description: "Descripcion del proyecto 1" },
  { id: 2, name: "Proyecto 2", description: "Descripcion del proyecto 2" },
  { id: 3, name: "Proyecto 3", description: "Descripcion del proyecto 3" },
  { id: 4, name: "Proyecto 4", description: "Descripcion del proyecto 4" },
];

export default function Works() {
  return (
    <div className="flex flex-col mt-14 px-4 md:px-20">
      <div className="flex justify-center md:justify-start">
        <ButtonAdd />
        <p className="text-lg items-center text-center ml-5 mt-1 text-gray-400">
          You have three proyects free
        </p>
      </div>
      <div className="text-center mt-5">
        <div className="text-center w-full">
          <div className="flex flex-wrap justify-center mt-10 ">
            {works.map((work) => (
              <Link to={`/SpaceWork`} key={work.id}>
                <div
                  key={work.id}
                  className="relative flex flex-col items-center justify-center w-64 h-64 m-5 rounded-lg bg-gray-100"
                >
                  <div className="absolute top-2 right-2">
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
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
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
