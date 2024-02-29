export default function CompartirProyecto() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-1 text-white  mr-5 hover:animate-jump">
      <button className="relative flex items-center justify-center space-x-2 md:space-x-2 p-1 w-full ">
        <span className="hidden md:inline text-lg md:text-sm ">Compartir</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      </button>
    </div>
  );
}
