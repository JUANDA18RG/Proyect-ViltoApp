import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import MenuBurguer from "../Components/MenuBurguer";

export default function NavbarPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.log(error);
    }
    navigate("/");
  };

  let displayName = "";
  let photoURL = "";
  let UDI = "";

  if (auth.user) {
    displayName = auth.user.displayName;
    photoURL = auth.user.photoURL;
    UDI = auth.user.uid;
  }

  return (
    <nav className="w-full h-16 px-4  bg-transparent flex items-center justify-between z-20">
      <div className="flex items-center space-x-4 animate-jump-in ml-2">
        <Link to={"/PageInit"}>
          <img className="w-10 h-10 rounded-md" src="Logo.png" alt="Workflow" />
        </Link>
        <div className="hidden sm:block">
          <Link to={"/PageInit"}>
            <div className="sm:text-xl md:text-2xl lg:text-xl font-bold text-gray-900">
              ViltoApp
            </div>
          </Link>
        </div>
      </div>
      <div className="md:hidden">
        <MenuBurguer />
      </div>

      <div className=" items-center space-x-4 hidden md:flex">
        <Menu as="nav" className="relative z-20">
          {({ open }) => (
            <>
              <Menu.Button
                className={`flex h-8 items-center rounded-3xl bg-white animate-jump-in
                  pr-2`}
              >
                {photoURL && (
                  <img
                    src={photoURL}
                    alt={UDI}
                    className={`w-10 h-10 rounded-full m-2 p-1 mr-1 border-2 border-red-400 `}
                  />
                )}
                <span className="sm:text-xl md:text-sm  font-bold text-gray-900 hidden md:block mr-1 ">
                  {displayName}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-4 h-4 text-black mr-2 mt-1 transition duration-300 ease-in-out ml-1 ${
                    open === true &&
                    "transform rotate-180 transition duration-300 ease-in-out"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Menu.Button>
              <Menu.Items
                className={
                  "absolute p-1 top-16 right-5 w-48 bg-active rounded-md translate-y-5 border-2 border-gray-400 shadow-sm bg-white md:text-sm animate-jump-in"
                }
              >
                <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out m-1">
                  {({ active }) => (
                    <Link
                      to={"/Usuario"}
                      className={`h-10 flex items-center justify-between px-2 text-sm rounded-md${
                        active && "bg-white text-white"
                      }`}
                    >
                      Perfil
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 m-1 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out m-1">
                  {({ active }) => (
                    <Link
                      className={`h-10 flex items-center justify-between px-2 text-sm rounded-md${
                        active && "bg-white text-white"
                      }`}
                      href="/"
                    >
                      Ajustes
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 m-1 ml-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out m-1">
                  {({ active }) => (
                    <div className="flex justify-between hover:text-white">
                      <button
                        className={`h-10 flex items-center px-2 text-sm rounded-md${active} justify-between`}
                        onClick={handleLogout}
                      >
                        Cerrar Sesión
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 m-1 ml-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </Menu.Item>
              </Menu.Items>
            </>
          )}
        </Menu>
      </div>
    </nav>
  );
}
