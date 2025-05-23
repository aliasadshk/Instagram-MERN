import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        closeOnClick
        pauseOnHover={false}
      />

      <App />
    </BrowserRouter>
  </React.StrictMode>
);
