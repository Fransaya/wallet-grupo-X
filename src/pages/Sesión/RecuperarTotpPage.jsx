import React, { useState } from "react";
import { Card, Typography, Space, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Endpoints from "../../API/Endpoints";
import { Input } from "../../components globales/Input";
import { Button } from "../../components globales/Button";

const { Title, Text } = Typography;

const RecuperarTotpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegenerarTotp = async () => {
    if (!username.trim() || !email.trim()) {
      message.warning("Completa el alias y el email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        Endpoints.getUrl(Endpoints.SESION.RECUPERAR), // ⚠️ Reemplaza por tu endpoint correcto
        {
          username,
          email,
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "TOTP regenerado correctamente");
				sessionStorage.setItem("user", JSON.stringify({ username }));
        // Redirige al VerificarTotpPage pasando el nuevo totpSetup por state
        navigate("/sesion/verificar-totp", {
          state: {
            totpSetup: response.data.totpSetup,
          },
        });
      } else {
        message.error(response.data.message || "No se pudo regenerar el TOTP");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al regenerar el TOTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title title-h1">Recuperar TOTP</h1>

      <Card className="login-card" bodyStyle={{ padding: "16px" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4}>Regenerar configuración de autenticación</Title>
          <Text>Si perdiste el acceso a tu app autenticadora, puedes generar un nuevo código.</Text>

          <Input
            placeholder="Alias"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="primary"
            onClick={handleRegenerarTotp}
            loading={loading}
            style={{ width: "100%" }}
          >
            Regenerar código
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default RecuperarTotpPage;