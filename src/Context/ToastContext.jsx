// src/Context/ToastContext.jsx
import { createContext, useState } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  // function باش تبان notification
  const showToast = (msg) => {
    setMessage(msg);

    setTimeout(() => {
      setMessage(null); // تختفي بعد 3 ثواني
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  );
}
