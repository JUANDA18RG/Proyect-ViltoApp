import Navbar from "./Navbar";
import { Footer } from "./footer";
import Home from "./home";

function Portada() {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default Portada;
