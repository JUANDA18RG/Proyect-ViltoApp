import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verifying] = useState(false);
  const [verify, setVerifying] = useState(false);

  console.log(auth);
  console.log(verify);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError(null);
    try {
      await auth.login(email, password);
      navigate("/PageInit");
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleGoogle = async (e) => {
    e.preventDefault();

    try {
      setVerifying(true);
      await auth.loginWithGoogle();
      // Si se autentica con Google, redirige a la misma página
      navigate("/PageInit");
    } catch (error) {
      setError("Error al iniciar sesión con Google. Intenta de nuevo.");
    } finally {
      setVerifying(false);
    }
  };

  const handleGithub = async (e) => {
    e.preventDefault();

    try {
      setVerifying(true);
      await auth.loginWithGithub();
      navigate("/PageInit");
    } catch (error) {
      setError("Error al iniciar sesión con Github. Intenta de nuevo.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-white md:p-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative z-10 border-2 border-red-500 md:p-5 animate-fade-left">
        <img
          src="Logo.png"
          alt="Logo"
          className="w-40 h-40 rounded-full mx-auto mt-2 mb-4  md:block"
        />
        <h1 className="text-2xl text-center text-gray-700 mb-4 font-bold  md:text-3xl">
          Login In ViltoApp
        </h1>
        <form className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Your Email"
              className="w-full py-2 pl-2 pr-10 border rounded-lg focus:outline-none focus:border-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full py-2 pl-2 pr-10 border rounded-lg focus:outline-none focus:border-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-2 top-2 cursor-pointer hover:text-red-700 opacity-70 transition duration-300"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </span>
          </div>
          {verifying ? (
            <div className="flex justify-center"></div>
          ) : (
            <button
              onClick={handleLogin}
              className="rounded-md w-full py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:bg-pink-700 transition duration-300 text-white"
            >
              Login
            </button>
          )}
          <button
            onClick={handleGoogle}
            className="w-full py-1 border-2 rounded-md "
          >
            <div className="flex items-center justify-center">
              <img
                className="w-8 h-8 rounded-md mr-2"
                src="Google.png"
                alt="Workflow"
              />
              <span>Google</span>
            </div>
          </button>
          <button
            onClick={handleGithub}
            className="w-full py-1 border-2 rounded-md "
          >
            <div className="flex items-center justify-center">
              <img
                className="w-8 h-8 rounded-md mr-2"
                src="GitHub.png"
                alt="Workflow"
              />
              <span>Github</span>
            </div>
          </button>
        </form>
        {error && (
          <div className="text-red-500 text-center text-sm m-2 md:text-md">
            {error}
          </div>
        )}
        <div className="text-center mt-4 text-gray-600">
          Already have an account?
          <Link to={"/SignUp"} className="ml-1 text-blue-500 hover:underline">
            Sign Up
          </Link>
        </div>
        <div className="text-center mt-4 text-gray-600">
          Forgot password?
          <Link to={"/"} className="ml-1 text-blue-500 hover:underline">
            Recover password
          </Link>
        </div>
      </div>
    </div>
  );
}
