import NavbarPage from "./NavbarPage";
import Work from "./works";
import Menu from "./Menu";

export default function PageInit() {
  return (
    <div className="bg-gradient-to-b from-gray-200 to-white animate-fade-right overflow-hidden h-screen ">
      <div className="bg-transparen">
        <NavbarPage />
        <div className="flex">
          <Menu />
          <Work />
        </div>
      </div>
    </div>
  );
}
