import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { routes } from "./routes/routes";
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
        
      </BrowserRouter>
    </>
  )
}

export default App
