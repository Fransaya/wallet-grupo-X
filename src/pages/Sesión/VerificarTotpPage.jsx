import React, { useState, useEffect } from "react";
import { Card, Typography, Space, message } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Endpoints from "../../API/Endpoints";
import { Input } from "../../components globales/Input";
import { Button } from "../../components globales/Button";

const { Title, Text, Paragraph } = Typography;

const VerificarTotpPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [instructions, setInstructions] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtenemos totpSetup desde la ruta si viene por location.state
    if (location.state && location.state.totpSetup) {
      const { qrCodeUrl, manualSetupCode, instructions } = location.state.totpSetup;
      setQrCodeUrl(qrCodeUrl);
      setManualCode(manualSetupCode);
      setInstructions(instructions);
    }
  }, [location.state]);

  const handleVerify = async () => {
    if (code.trim().length === 0) {
      message.warning("Por favor ingresa el código TOTP");
      return;
    }

    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");
      const user = JSON.parse(sessionStorage.getItem("user"));

      const response = await axios.post(
        Endpoints.getUrl(Endpoints.SESION.VERIFICAR), // ✅ Tu endpoint real
        {
          username: user.username,
          totpToken: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success("Verificación exitosa");
        user.isVerified = true;
        user.totpVerified = true;
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        message.error(response.data.message || "Código incorrecto");
      }
    } catch (error) {
      console.error(error);
      message.error("Error verificando el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title title-h1">Configurar Verificación 2FA</h1>

      <Card className="login-card" bodyStyle={{ padding: "16px" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={4}>Paso 1: Configura tu autenticación</Title>

          {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: "100%" }} />}

          {manualCode && (
            <Paragraph copyable strong>
              Código manual: {manualCode}
            </Paragraph>
          )}

          {instructions && <Text type="secondary">{instructions}</Text>}

          <Title level={5} style={{ marginTop: "1rem" }}>
            Paso 2: Ingresa el código generado por tu app
          </Title>

          <Input
            placeholder="Código TOTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />

          <Button
            type="primary"
            onClick={handleVerify}
            loading={loading}
            style={{ width: "100%" }}
          >
            Verificar
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default VerificarTotpPage;