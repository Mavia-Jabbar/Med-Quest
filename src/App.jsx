import "./App.css";
import { Navbar1 } from "@/components/navbar1";
import { SignupForm } from "@/components/signup-form";
import { LoginForm } from "@/components/login-form";
import { Routes, Route, useLocation, Navigate } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthRedirect from "@/components/AuthRedirect";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "@/components/DashboardLayout";
import StudyMaterials from "./pages/StudyMaterials";
import Flashcards from "./pages/Flashcards";
import { useFirebase } from "@/Context/firebase";

function App() {
  const location = useLocation();
  const { isLoggedIn } = useFirebase();
  const hideNavbarRoutes = ["/Dashboard", "/dashboard", "/Materials", "/Flashcards", "/MockTests", "/Tutor"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar1 />}
      <Routes>
        <Route path="*" element={<h1>404</h1>}></Route>

        <Route element={<AuthRedirect />}>
          <Route
            path="/Signup"
            element={
              <div className="flex min-h-svh w-full items-center justify-center ">
                <div className="w-full max-w-sm">
                  <SignupForm />
                </div>
              </div>
            }
          ></Route>

          <Route
            path="/Login"
            element={
              <div className="flex min-h-svh w-full items-center justify-center ">
                <div className="w-full max-w-sm">
                  <LoginForm />
                </div>
              </div>
            }
          ></Route>
        </Route>

        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/Dashboard" replace /> : <Home />} 
        />
        <Route path="/About" element={<About />} />
        <Route path="/Pricing" element={<Pricing />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Materials" element={<StudyMaterials />} />
            <Route path="/Flashcards" element={<Flashcards />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
