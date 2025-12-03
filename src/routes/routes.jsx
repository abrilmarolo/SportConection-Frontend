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
import { EditProfile } from "../pages/Profile/components/EditProfile";
import { FrequentQuestions } from "../pages/FrequentQuestions/FrequentQuestions";
import { RegisterPartTwo } from "../pages/Register/components/RegisterPartTwo";
import { Subscription } from "../pages/Subscription/Subscription";
import { SubscriptionSuccess } from "../pages/Subscription/components/SubscriptionSuccess";
import { SubscriptionCancel } from "../pages/Subscription/components/SubscriptionCancel";

import { CreateLocation } from "../pages/Admin/Location/CreateLocation";
import { CreateSport } from "../pages/Admin/Sport/CreateSport";
import { User } from "../pages/Admin/User/User";
import { Location } from "../pages/Admin/Location/Location";
import { Sport } from "../pages/Admin/Sport/Sport";
import { Plan } from "../pages/Admin/Plan/Plan";
import { CreatePlan } from "../pages/Admin/Plan/CreatePlan";

export const publicRoutes = [
    { path: "/", element: <Home />, name: "" },
    { path: "/AcercaDeNosotros", element: <AboutUs />, name: "Acerca de" },
    { path: "/PreguntasFrecuentes", element: <FrequentQuestions />, name: "Preguntas Frecuentes" },
    { path: "/Contacto", element: <Contact />, name: "Contacto" },
];

export const profileRoute = { path: "/Perfil", element: <Profile />, name: "Perfil" }
export const editProfileRoute = { path: "/EditarPerfil", element: <EditProfile />, name: "Editar Perfil" };
  

export const authRoutes = [
    { path: "/Registro", element: <Register />, name: "Registrarse"},
    { path: "/InicioSesion", element: <LogIn />, name: "Iniciar Sesión"},
];

export const userRoutes = [
    { path: "/Publicaciones", element: <Post />, name: "Publicaciones"},
    { path: "/Match", element: <Match />, name: "Hacer Match"},
    { path: "/Chat", element: <Chat />, name: "Chats"},
    { path: "/Mapa", element: <Map />, name: "Mapa"},
];

export const adminRoutes = [
    { path: "/Deportes", element: <Sport />, name: "Deportes"},
    { path: "/Ubicacion", element: <Location />, name: "Ubicaciones"},
    { path: "/Usuarios", element: <User />, name: "Usuarios"},
    { path: "/Plan", element: <Plan />, name: "Planes"},
];
 
export const adminCreateRoutes = [
    { path: "/CrearUbicacion", element: <CreateLocation />, name: "Crear Ubicación"},
    { path: "/CrearDeporte", element: <CreateSport />, name: "Crear Deporte"},
    { path: "/CrearPlan", element: <CreatePlan />, name: "Crear Plan"},
];
export const registerPartTwoRoute = { path: "/RegistroTipoDeUsuario", element: <RegisterPartTwo />, name: "Registro Parte Dos" };
export const subscriptionRoute = { path: "/Suscripcion", element: <Subscription />, name: "Suscripción Premium" };
export const subscriptionSuccessRoute = { path: "/success", element: <SubscriptionSuccess />, name: "Suscripción Exitosa" };
export const subscriptionCancelRoute = { path: "/cancel", element: <SubscriptionCancel />, name: "Pago Cancelado" };

export const routes = [...publicRoutes, ...authRoutes, ...userRoutes, ...adminRoutes, profileRoute, subscriptionRoute, subscriptionSuccessRoute, subscriptionCancelRoute, editProfileRoute, registerPartTwoRoute, ...adminCreateRoutes];