import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "../context/authContext";
import io from "socket.io-client";
import { toast } from "react-toastify";
import Corona from "/Corona.png";

const initialOptions = {
  clientId:
    "ARCLpq8lbcq1K_qe7SD40eNTe9pHbTXfFIrSz2YaKxwE_47TrXBJndEm1T-x9zyTeq0E87OS4yWwVi4b",
  intent: "capture",
};

export default function Pago() {
  const auth = useAuth();
  const socket = io("http://localhost:3000");

  const devolver = () => {
    window.history.back();
  };

  const handleApprove = async (data, actions) => {
    try {
      await actions.order.capture();
      socket.emit("PagoParaPremium", { email: auth.email });
      toast.success(`Pago exitoso, ${auth.name}. Ahora eres premium.`, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(`Hubo un error al procesar el pago: ${error.message}`, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleError = (err) => {
    console.error("Error en el pago: ", err);
  };

  return (
    <div className="animate-fade-right">
      <div
        className="fixed inset-0 bg-bottom bg-no-repeat bg-cover transform rotate-180 opacity-60"
        style={{ backgroundImage: `url('../../wavesOpacity.svg')` }}
      ></div>
      <button
        onClick={devolver}
        className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-full shadow-md hover:animate-jump"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <div className="flex items-center justify-center h-screen bg-gray-100 z-10">
        <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl text-center max-w-md w-full z-20">
          <h2 className="text-2xl text-gray-500 mb-10">
            Realiza tu pago para pasarte a premium en{" "}
            <span className="text-white bg-gradient-to-r from-red-500 to-pink-500 p-1 text-xl rounded-lg">
              ViltoApp
            </span>
          </h2>
          <div className="flex  items-center justify-center mb-5">
            <div className="border-red-500 ">
              <img
                src={auth.user.photoURL}
                alt="User"
                className="w-24 h-24 border-2  border-red-500 rounded-full mb-6 shadow-sm animate-jump-in p-1"
              />
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 mb-5 m-5 text-gray-400 animate-fade-up"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>

            <div className="relative w-24 h-24 mb-5 animate-jump-in ">
              <img
                src={auth.user.photoURL}
                alt="User"
                className="w-full h-full border-2  rounded-full p-1 border-red-500"
              />
              <img
                src={Corona}
                alt="Corona"
                className="absolute w-12 h-10 -rotate-45 shadow-sm "
                style={{ top: "-20%", left: "-15%" }}
              />
            </div>
          </div>

          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "blue",
                shape: "pill",
                label: "pay",
                tagline: false,
              }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: "Artículo que se va a comprar",
                      amount: {
                        value: "1.0",
                        currency_code: "USD",
                      },
                    },
                  ],
                });
              }}
              onApprove={handleApprove}
              onError={handleError}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}
