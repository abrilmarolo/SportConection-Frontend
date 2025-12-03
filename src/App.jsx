import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { PremiumProvider } from "./context/PremiumContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { routes } from "./routes/routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <PremiumProvider>
              <AdminProvider>
                <div className="min-h-screen">
                  <Navbar />
                  <Routes>
                    {routes.map((route) => (
                      <Route
                        key={route.name}
                        path={route.path}
                        element={route.element}
                      />
                    ))}
                  </Routes>
                  <Footer />
                </div>
              </AdminProvider>
            </PremiumProvider>
          </AuthProvider>
          <ToastContainer />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  )
}

export default App
