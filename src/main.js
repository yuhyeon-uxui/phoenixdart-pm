import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/app.css";

createRoot(document.getElementById("root")).render(React.createElement(App));
