export default function AlertError() {
  return (
    <div className="animate-fade-left bg-white py-4 px-6 max-w-md border-l-4 border-red-600 rounded-lg flex items-center gap-3 shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 text-red-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold">Error</h3>
        <p className="text-gray-500">
          Ha ocurrido un error al registrar la cuenta
        </p>
      </div>
    </div>
  );
}
