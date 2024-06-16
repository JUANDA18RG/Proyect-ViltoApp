import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import Corona from "/assets/Corona.png";
import io from "socket.io-client";
import logo from "/assets/Logo.png";
import { useEffect, useState } from "react";
import userImage from "/assets/user.png";
import { Switch } from "@headlessui/react";

export default function NavbarPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const socket = io(import.meta.env.VITE_BACKEND_URL); // Asegúrate de reemplazar esto con tu URL de servidor
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isEnabled = JSON.parse(saved) || false;
    setEnabled(isEnabled);
  }, []);

  const handleSwitchChange = (newEnabled) => {
    setEnabled(newEnabled);
    localStorage.setItem("darkMode", JSON.stringify(newEnabled));
    window.dispatchEvent(new Event("darkModeChange"));
  };
  useEffect(() => {
    if (auth.user) {
      socket.emit("obtenerEstadoPremium", auth.user.email);
      socket.on("estadoPremium", (estadoPremium) => {
        setIsPremium(estadoPremium);
        console.log(estadoPremium);
      });
      socket.on("error", (error) => {
        console.error(error);
      });
    }
    return () => {
      socket.off("estadoPremium");
      socket.off("error");
      console.log(isPremium);
    };
  }, [auth.user, socket]);

  const handleLogout = async () => {
    try {
      await auth.logout();
      localStorage.clear();
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
    <nav
      className={`w-full h-16 px-4 flex items-center justify-between z-20 relative  transform transition-all duration-500 ease-in-out ${
        enabled ? "bg-gray-800" : "bg-transparent"
      }`}
    >
      <div className="flex items-center space-x-4 animate-jump-in ml-2">
        <Link to={"/PageInit"}>
          <img className=" w-10 h-10 rounded-lg" src={logo} alt="Workflow" />
        </Link>
        <div className="hidden sm:block">
          <Link to={"/PageInit"}>
            <div
              className={`sm:text-xl md:text-2xl lg:text-xl font-bold ${
                enabled ? "text-white" : "text-gray-900"
              }`}
            >
              ViltoApp
              <span
                className="text-red-500 text-sm"
                style={{ verticalAlign: "super" }}
              >
                CO
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className=" items-center space-x-14 hidden md:flex ">
        {!auth.isPremium && (
          <Link
            to={"/Pago"}
            className="relative flex items-center justify-center h-8 px-3 text-sm font-medium text-white rounded-lg bg-gradient-to-b from-purple-500 to-pink-500 animate-jump-in "
          >
            <img
              src={Corona}
              alt="Corona"
              className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-10 h-8 -rotate-45 "
            />
            <span className="mr-2 ml-2 font-semibold">Get Premium</span>
          </Link>
        )}
        <Switch
          checked={enabled}
          onChange={handleSwitchChange}
          className={`${
            enabled ? "bg-gray-600" : "bg-gray-200"
          } relative inline-flex items-center h-9 rounded-full w-20 transition-colors duration-200 ease-in-out m-4`}
        >
          <span
            className={`${
              enabled
                ? "translate-x-11 bg-black text-white"
                : "translate-x-1 bg-white text-black"
            } w-8 h-8 transform rounded-full transition-transform flex items-center justify-center`}
          >
            {!enabled && (
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
                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                />
              </svg>
            )}
            {enabled && (
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
                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                />
              </svg>
            )}
          </span>
        </Switch>
        <Menu as="nav" className="relative z-10">
          {({ open }) => (
            <>
              <Menu.Button
                className={`flex h-8 items-center rounded-3xl animate-jump-in pr-2 ${
                  enabled ? "bg-gray-600 text-white" : "bg-white text-gray-900"
                }`}
              >
                <img
                  src={photoURL ? photoURL : userImage}
                  alt={UDI}
                  className={`w-12 h-12 rounded-full m-2 p-1 mr-1 border-2 border-red-500 `}
                />
                <span
                  className={`sm:text-xl md:text-sm font-bold hidden md:block mr-1 ${
                    enabled ? "text-white" : "text-gray-900"
                  }`}
                >
                  {displayName}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-4 h-4 mr-2 transition duration-300 ease-in-out ml-1 ${
                    enabled ? "text-white" : "text-black"
                  } ${
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
                className={`absolute p-1 top-16 right-5 w-48 rounded-md translate-y-5 border-2 shadow-sm md:text-sm animate-jump-in z-50 ${
                  enabled
                    ? "bg-gray-600 text-white border-gray-800"
                    : "bg-white text-gray-900 border-gray-400"
                }`}
              >
                <Menu.Item className="hover:bg-gradient-to-r from-red-500 to-pink-500 rounded-md transition duration-100 ease-in-out m-1">
                  {({ active }) => (
                    <Link
                      to={"/Usuario"}
                      className={`h-10 flex items-center justify-between px-2 text-sm rounded-md${
                        active && "bg-white text-white"
                      }`}
                    >
                      Profile
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
                      Settings
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
                        Sign off
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 m-1 ml-20"
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
