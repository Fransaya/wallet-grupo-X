import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const isAuthenticated = token && token !== 'undefined' && token !== '';
  return isAuthenticated ? children : <Navigate to="/sesion/login" replace />;
};

export default RutaProtegida;
