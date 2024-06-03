export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-1 border-t bg-slate-100 flex items-center justify-center animate-fade-up">
      <div className="flex items-center justify-center space-x-10">
        <div className="flex flex-row items-center space-x-3">
          <p className="text-sm sm:text-base font-semibold text-gray-600">
            Frontend
          </p>
          <a
            href="https://github.com/JUANDA18RG/Proyect-ViltoApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="w-8 h-8 rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: "url('/assets/GitHub.png')",
              }}
            ></button>
          </a>
        </div>
        <p className="font-semibold text-sm sm:text-base">|</p>
        <div className="flex flex-row items-center space-x-3">
          <a
            href="https://github.com/JUANDA18RG/Proyect-ViltoApp-Backend"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="w-8 h-8 rounded-full bg-no-repeat bg-center bg-cover"
              style={{
                backgroundImage: "url('/assets/GitHub.png')",
              }}
            ></button>
          </a>
          <p className="text-sm sm:text-base font-semibold text-gray-600">
            Backend
          </p>
        </div>
      </div>
    </div>
  );
};
