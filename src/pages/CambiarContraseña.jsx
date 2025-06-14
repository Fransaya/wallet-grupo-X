import "../stilos/contrasena.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CambiarContraseña = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user") || {});
  const navigate = useNavigate();

  // Devuelve un array de errores
  const getPasswordErrors = (password, confirmPassword) => {
    const errors = [];
    if (password.length < 8) errors.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Al menos una minúscula");
    if (!/[0-9]/.test(password)) errors.push("Al menos un número");
    if (!/[^A-Za-z0-9]/.test(password))
      errors.push("Al menos un carácter especial");
    if (confirmPassword !== undefined && password !== confirmPassword)
      errors.push("Las contraseñas no coinciden");
    return errors;
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordErrors(getPasswordErrors(value, confirmPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordErrors(getPasswordErrors(newPassword, value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = getPasswordErrors(newPassword, confirmPassword);
    setPasswordErrors(errors);
    if (errors.length > 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2500);
      return;
    }
  };

  const handleCancel = () => {
    navigate(`/datos-user/${user.name}`);
  };

  return (
    <div className="dashboard-container">
      <div className="password-change-container">
        <div className="password-form-section">
          <h1>Cambiar Contraseña</h1>
          <form>
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {/* Mostrar errores debajo del input */}
              {passwordErrors.length > 0 && (
                <ul className="password-errors">
                  {passwordErrors.map((err, idx) => (
                    <li key={idx} style={{ color: "#bb0a21", fontSize: 14 }}>
                      {err}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="container-btn">
              <button
                className="btn-cancelar ant-btn"
                type="button"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-password ant-btn ant-btn-primary"
                onClick={handleSubmit}
              >
                Cambiar Contraseña
              </button>
            </div>
          </form>
          <div className="text-info">
            <p>
              Al restablecer la contraseña, debera volver a iniciar sesion en
              todos los disposivitos guardados.
            </p>
            <p>
              Por su seguridad verifique los datos y contraseña antes de
              efectuar el cambio.
            </p>
          </div>
          {showAlert && (
            <div className="custom-alert">
              La nueva contraseña no cumple con los requisitos o las contraseñas
              no coinciden.
            </div>
          )}
        </div>
        <div className="password-rules-section">
          <h2>Requisitos para la nueva contraseña</h2>
          <ul>
            <li>Mínimo 8 caracteres</li>
            <li>Al menos una mayúscula</li>
            <li>Al menos una minúscula</li>
            <li>Al menos un número</li>
            <li>Al menos un carácter especial</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CambiarContraseña;
