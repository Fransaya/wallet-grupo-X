import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Sesión/Login";
import Recuperar from "./pages/Sesión/RecuperarSesión";
import RutaProtegida from "./routes/RutaProtegida";
import RutaPublica from "./routes/RutaPublica";
import Dashboard from "./pages/Dashboard";
import RegistrarSesion from "./pages/Sesión/RegistrarSesión";
import Transferir from "./pages/Transferir";
import DetalleMovimiento from "./pages/DetalleMovimiento";
import CambiarContraseña from "./pages/CambiarContraseña";
import DatosUser from "./pages/DatosUser";
import Historial from "./pages/Historial";

function App() {
  const token = sessionStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "";

  return (
    <Router>
      <Routes>
        {/* Ruta específica */}
        <Route
          path="/sesion/login"
          element={
            <RutaPublica>
              <Login />
            </RutaPublica>
          }
        />
        <Route
          path="/sesion/recuperar"
          element={
            <RutaPublica>
              <Recuperar />
            </RutaPublica>
          }
        />
        <Route
          path="/sesion/registrar"
          element={
            <RutaPublica>
              <RegistrarSesion />
            </RutaPublica>
          }
        />

        {/* Ruta protegida: solo entra si hay token */}
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/transferir"
          element={
            <RutaProtegida>
              <Transferir />
            </RutaProtegida>
          }
        />
        <Route
          path="/detalle-transacciones"
          element={
            <RutaProtegida>
              <DetalleMovimiento />
            </RutaProtegida>
          }
        />

        <Route
          path="/cambiar-password"
          element={
            <RutaProtegida>
              <CambiarContraseña />
            </RutaProtegida>
          }
        />

        <Route
          path="/datos-user/:nombre"
          element={
            <RutaProtegida>
              <DatosUser />
            </RutaProtegida>
          }
        />

        {/* ruteo al historial (datos aun hardcodeados)*/}
        <Route
          path="/historial"
          element={
            <RutaProtegida>
              <Historial />
            </RutaProtegida>
          }
        />

        {/* Cualquier otra ruta redirige según estado de login */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/sesion/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
