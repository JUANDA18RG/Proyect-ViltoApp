import { Routes, Route } from "react-router-dom";
import SignUp from "./login/sign-up";
import SignIn from "./login/sign-in";
import Portada from "./login/Portada";
import { AuthProvider } from "./context/authContext";
import PageInit from "./Home/pageInit";
import SpaceWork from "./Components/SpaceWork";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/PageInit" element={<PageInit />} />
        <Route path="/SpaceWork" element={<SpaceWork />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
