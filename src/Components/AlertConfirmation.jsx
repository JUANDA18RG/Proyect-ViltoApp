import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AlertConfirmation = ({ message, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [alertQueue, setAlertQueue] = useState([]);
  const [alertCounter, setAlertCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress <= 0) {
          clearInterval(interval);
          // Espera un tiempo antes de mostrar la próxima alerta
          setTimeout(() => {
            if (alertQueue.length > 0) {
              const nextAlert = alertQueue[0];
              setAlertQueue((prevQueue) => prevQueue.slice(1));
              onDismiss();
              // Espera un tiempo antes de mostrar la próxima alerta
              setTimeout(() => {
                setAlertCounter((prevCounter) => prevCounter + 1);
                setAlertQueue((prevQueue) => [...prevQueue, nextAlert]);
              }, 500);
            } else {
              onDismiss();
            }
          }, 500);
        }
        return Math.max(oldProgress - 20, 0);
      });
    }, 700);

    return () => {
      clearInterval(interval);
    };
  }, [onDismiss, alertQueue, alertCounter]);

  useEffect(() => {
    if (message) {
      setAlertQueue((prevQueue) => [
        ...prevQueue,
        { message, id: alertCounter },
      ]);
    }
  }, [message, alertCounter]);

  return (
    <div
      className={`animate-fade-left bg-slate-50 py-3 px-4 max-w-md rounded-lg flex flex-col items-start gap-3 shadow-lg fixed bottom-7 right-10 z-${alertCounter}`}
    >
      <div className="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg mt-1 p-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <h3 className="font-semibold text-sm">Éxito</h3>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>
      </div>
      <div className="h-1 w-full rounded-lg shadow-lg overflow-hidden">
        <div
          className="bg-gradient-to-r from-red-500 to-pink-500 h-full transition-all duration-1000 ease-in-out rounded-lg"
          style={{ width: `${progress}%`, marginRight: `${100 - progress}%` }}
        ></div>
      </div>
    </div>
  );
};

AlertConfirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default AlertConfirmation;
