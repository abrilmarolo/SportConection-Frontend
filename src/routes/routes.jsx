import { Home } from "../pages/Home/Home";
import { AboutUs } from "../pages/AboutUs/AboutUs";
import { Contact } from "../pages/Contact/Contact";
import { LogIn } from "../pages/LogIn/LogIn";
import { Register } from "../pages/Register/Register";
import { Post } from "../pages/Post/Post";
import { Match } from "../pages/Match/Match";
import { Chat } from "../pages/Chat/Chat";
import { Map } from "../pages/Map/Map";
import { Profile } from "../pages/Profile/Profile";
import { FrequentQuestions } from "../pages/FrequentQuestions/FrequentQuestions";
import { RegisterPartTwo } from "../pages/Register/components/RegisterPartTwo";

export const routes = [
    { path: "/", element: <Home />, name: "" },
    { path: "/AcercaDeNosotros", element: <AboutUs />, name: "Acerca de" },
    { path: "/PreguntasFrecuentes", element: <FrequentQuestions />, name: "Preguntas Frecuentes" },
    { path: "/Contacto", element: <Contact />, name: "Contacto" },
    { path: "/Registro", element: <Register />, name: "Registrarse"},
    { path: "/InicioSesion", element: <LogIn />, name: "Iniciar Sesión"},
    { path: "/RegistroTipoDeUsuario", element: <RegisterPartTwo />, name: "Tipo de Usuario" },
    { path: "/Post", element: <Post />, name: "Publicaciones"},
    { path: "/Match", element: <Match />, name: "Hacer Match"},
    { path: "/Chat", element: <Chat />, name: "Chats"},
    { path: "/Mapa", element: <Map />, name: "Mapa"},
    { path: "/Perfil", element: <Profile />, name: "Perfil"},
];