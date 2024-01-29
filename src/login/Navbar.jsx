import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center justify-between z-20">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img className="w-10 h-10 rounded-md" src="Logo.png" alt="Workflow" />
        </Link>
        <div className="hidden sm:block">
          <Link to="/">
            <div className="sm:text-xl md:text-2xl lg:text-xl font-bold text-gray-900">
              ViltoApp
            </div>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-sm sm:text-base font-bold py-2 px-4 rounded">
          <Link to={"/SignIn"}>Login</Link>
        </button>
        <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm sm:text-base font-bold py-2 px-4 rounded">
          <Link to={"/SignUp"}>Registre</Link>
        </button>
      </div>
    </div>
  );
}
