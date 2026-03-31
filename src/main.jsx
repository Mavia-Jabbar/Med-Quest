import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FirebaseProvider } from "./Context/firebase";
import { BrowserRouter } from "react-router";
import { VideoThemeProvider } from "./Context/VideoThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FirebaseProvider>
      <VideoThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </VideoThemeProvider>
    </FirebaseProvider>
  </StrictMode>,
);
