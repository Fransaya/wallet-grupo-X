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
  // const [alias, setAlias] = useState("");
  // const [totp, setTotp] = useState("");
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
        sessionStorage.setItem(
          "transactions",
          JSON.stringify(historialResponse.data.transactions)
        );
        sessionStorage.setItem("balance", historialResponse.data.user.balance);
      }

      if (response.data.success) {
        const { user, needsTotpSetup } = response.data;
        console.log(response)

        sessionStorage.setItem("token", response.data.success);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("balance", user.balance || 0);

        message.success(response.data.message || "Inicio de sesión exitoso");

        // ✅ Verificación TOTP
        if (!user.isVerified || needsTotpSetup || !user.totpVerified) {
          navigate("/sesion/verificar-totp", { state: { totpSetup: response.data.totpSetup } });
        } else {
          navigate("/dashboard");
        }

      } else {
        message.error(response.data.message || "Error en autenticación con Auth0");
      }
    } catch (error) {
      console.error("Error autenticando con Auth0:", error);
      message.error("Error autenticando con Auth0");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title title-h1">RauloCoins</h1>
      <Card className="login-card" bodyStyle={{ padding: "12px" }}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Button
            className="auth0-button"
            onClick={handleLoginWithAuth0}
            loading={loading}
            style={{ width: "100%" }}
          >
            Ingresar con Auth0
          </Button>

          <Button
            className="recuperar-button"
            style={{ width: "100%" }}
            // onClick={handleLogin}
            loading={loading}
          >
            Recuperar
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
