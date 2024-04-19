import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from "../context/authContext";
import io from "socket.io-client";
import { toast } from "react-toastify";

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
      socket.emit("PagoParaPremium", { email: auth.email }); // Reemplaza "email_del_usuario" con el email del usuario
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
    // Este código se ejecutará si ocurre un error en el proceso de pago
    console.error("Error en el pago: ", err);
    // Puedes agregar aquí más lógica, como mostrar un mensaje de error al usuario
  };

  return (
    <div className="animate-fade-right">
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
      <div className="flex items-center justify-center h-screen bg-gray-100 ">
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl text-center h-80 w-80">
          <h2 className="text-2xl text-gray-400 mb-7  rounded-lg">
            Realiza tu pago para pasarte a premieun en ViltoApp
          </h2>
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
