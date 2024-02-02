import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center h-screen p-4 md:p-8">
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src="Banner.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute w-full h-full bg-gradient-to-t from-gray-900 to-white opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <div className="mr-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.5 17L6 12l1.5-1.5L9.5 14l6.5-6.5L18 8l-8.5 9z"
              />
            </svg>
          </div>
          No 1 task managmet
        </div>
        <h1 className="mb-2 text-3xl md:text-6xl uppercase text-center text-neutral-900 ">
          ViltoApp helps team move
        </h1>
        <div className="m-2 text-3xl md:text-6xl uppercase bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 p-2 rounded-md pb-4 w-fit ">
          work forward
        </div>
        <div className=" text-sm md:text-xl text-slate-900 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
          Colaborate, manage projects, and reach new productivity peaks. From
          high rises to the home office, the way your team works is
          unique—accomplish it all with ViltoApp.
        </div>
        <button className=" m-5 text-sm md:text-xl text-white bg-black px-4 py-2 rounded-md shadow-sm hover:animate-jump">
          <Link to={"/SignUp"}>Get ViltoApp for free</Link>
        </button>
      </div>
    </div>
  );
}
