import React, { useState } from "react";
import "./login.css";
import { Card, Typography, Space, message } from "antd";
import { Link } from "react-router-dom";
import Endpoints from "../../API/Endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "../../components globales/Input";
import { Button } from "../../components globales/Button";

const { Title } = Typography;

const Login = () => {
  const [alias, setAlias] = useState("");
  const [totp, setTotp] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithPopup, getIdTokenClaims, getAccessTokenSilently } =
    useAuth0();

  const navigate = useNavigate();

  const handleLoginWithAuth0 = async () => {
    try {
      setLoading(true);

      // Abrir popup de login
      await loginWithPopup();

      // Obtener tokens e información del usuario
      const accessToken = await getAccessTokenSilently();
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims.__raw;

      const payload = {
        iss: idTokenClaims.iss,
        sub: idTokenClaims.sub,
        aud: idTokenClaims.aud,
        iat: idTokenClaims.iat,
        exp: idTokenClaims.exp,
        email: idTokenClaims.email,
        name: idTokenClaims.name,
        nickname: idTokenClaims.nickname,
        given_name: idTokenClaims.given_name,
        family_name: idTokenClaims.family_name,
      };

      const tokens = {
        access_token: accessToken,
        id_token: idToken,
        refresh_token: "", // Si lo usás
        token_type: "Bearer",
        expires_in: idTokenClaims.exp - idTokenClaims.iat,
        scope: idTokenClaims.scope || "openid profile email",
      };

      // Autenticar en tu backend
      const response = await axios.post(
        Endpoints.getUrl(Endpoints.SESION.AUTH0_AUTHENTICATE),
        {
          auth0_payload: payload,
          auth0_tokens: tokens,
        }
      );

      const historialConfig = {
        method: "POST",
        url: Endpoints.getUrl(Endpoints.TRANSFERENCIA.HISTORIALAUTH),
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: idTokenClaims.email,
        },
      };

      const historialResponse = await axios(historialConfig);

      if (historialResponse.data.success) {
        console.log(
          "Historial de transacciones:",
          historialResponse.data.transactions
        );
        sessionStorage.setItem(
          "transactions",
          JSON.stringify(historialResponse.data.transactions)
        );
        sessionStorage.setItem("balance", historialResponse.data.user.balance);
      }

      if (response.data.success) {
        sessionStorage.setItem("token", response.data.success);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        sessionStorage.setItem("balance", response.data.user.balance || 0);

        message.success(response.data.message || "Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        message.error(
          response.data.message || "Error en autenticación con Auth0"
        );
      }
    } catch (error) {
      console.error("Error autenticando con Auth0:", error);
      message.error("Error autenticando con Auth0");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!alias || !totp) {
      message.warning("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      const loginConfig = {
        method: "POST",
        url: Endpoints.getUrl(Endpoints.SESION.LOGIN),
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: alias,
          totpToken: totp,
        },
      };

      const loginRespose = await axios(loginConfig);

      sessionStorage.setItem("token", loginRespose.data.success);
      sessionStorage.setItem("user", JSON.stringify(loginRespose.data));

      const historialConfig = {
        method: "POST",
        url: Endpoints.getUrl(Endpoints.TRANSFERENCIA.HISTORIAL),
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: alias,
          totpToken: totp,
        },
      };

      const historialResponse = await axios(historialConfig);

      if (historialResponse.data.success) {
        sessionStorage.setItem(
          "transactions",
          JSON.stringify(historialResponse.data.transactions)
        );
        sessionStorage.setItem("balance", historialResponse.data.user.balance);
      }

      message.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      message.error("Error al iniciar sesión. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title title-h1">RauloCoins</h1>
      <Card className="login-card" bodyStyle={{ padding: "12px" }}>
        <h3 className="login-subtitle title-h3">INGRESAR</h3>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <h5 className="login-label title-h5">Alias</h5>
          <Input
            placeholder="Alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
          />
          <h5 className="login-label title-h5">TOTP</h5>
          <Input
            placeholder="TOTP"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
          />

          <Button
            className="auth0-button"
            onClick={handleLoginWithAuth0}
            loading={loading}
            style={{ width: "100%" }}
          >
            Ingresar con Auth0
          </Button>

          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleLogin}
            loading={loading}
          >
            Ingresar
          </Button>

          <div className="login-links">
            <Link to="/sesion/recuperar">Recuperar</Link>
            <Link to="/sesion/registrar">Registrarse</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
