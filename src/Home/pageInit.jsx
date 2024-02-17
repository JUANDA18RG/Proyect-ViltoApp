import NavbarPage from "./NavbarPage";
import Work from "./works";

export default function PageInit() {
  return (
    <div className="bg-gradient-to-b from-gray-200 to-white animate-fade-right overflow-hidden">
      <NavbarPage />
      <Work />
    </div>
  );
}
