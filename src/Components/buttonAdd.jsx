export default function ButtonAdd() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-md p-2 text-white animate-jump-in">
      <button className="relative flex items-center justify-center space-x-2 md:space-x-4 px-1 py-1 w-full">
        <span className="hidden md:inline text-sm md:text-sm">
          Agregar Proyecto
        </span>
        <div className="md:flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
