import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")).render(

  <BrowserRouter>
    <App />
    <ToastContainer position="top-right" autoClose={2000} />
  </BrowserRouter>

);