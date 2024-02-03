import Navbar from "./Navbar";
import { Footer } from "./footer";
import Home from "./home";

function Portada() {
  return (
    <div className="animate-fade-right">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}

export default Portada;
