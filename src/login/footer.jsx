export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-1 border-t bg-slate-100 flex items-center justify-center animate-fade-up">
      <div className="space-x-10 flex items-center justify-center">
        <button className="h-10 text-md text-neutral-400">
          Privacy Polity
        </button>
        <p className="text-neutral-400 mx-2">|</p>
        <button className="h-10 text-md text-neutral-400">
          Terms of Service
        </button>
      </div>
    </div>
  );
};
