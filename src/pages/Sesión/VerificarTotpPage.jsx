import React, { useState, useEffect } from "react";
import { Card, Typography, Space, message } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Endpoints from "../../API/Endpoints";
import { Input } from "../../components globales/Input";
import { Button } from "../../components globales/Button";
import "./VerificarTotpPage.css";

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
      const { qrCodeUrl, manualSetupCode, instructions } =
        location.state.totpSetup;
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

      // const token = sessionStorage.getItem("token");

      const user = JSON.parse(sessionStorage.getItem("user"));
      console.log("ur", user);

      const response = await axios.post(
        Endpoints.getUrl(Endpoints.SESION.VERIFICAR), // ✅ Tu endpoint real
        {
          username: user.username ? user.username : user,
          totpToken: code,
        }
      );

      if (response.data.success) {
        message.success("Verificación exitosa");
        user.isVerified = true;
        user.totpVerified = true;
        console.log("user", user);
        const emailTemp = sessionStorage.getItem("emailTemp");
        sessionStorage.setItem("token", JSON.stringify(response.data.token));

        const historialConfig = {
          method: "POST",
          url: Endpoints.getUrl(Endpoints.TRANSFERENCIA.HISTORIALAUTH),
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            email: emailTemp,
          },
        };

        const historialResponse = await axios(historialConfig);

        if (historialResponse.data.success) {
          const userData = {
            ...user,
            name: response.data.user.name,
            email: emailTemp || user.email,
            balance: historialResponse.data.user.balance, // Aseguramos que el email esté actualizado
          };
          sessionStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem(
            "transactions",
            JSON.stringify(historialResponse.data.transactions)
          );
        }

        // consulto nuevamente el usuario para asegurarme de que está actualizado

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
    <div className="verificar-totp-container">
      <div className="verificar-totp-center">
        <h1 className="verificar-totp-title">Configurar Verificación 2FA</h1>
        <Card
          className="verificar-totp-card"
          bodyStyle={{
            padding: 0,
            background: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4} className="verificar-totp-step-title">
              Paso 1: Configura tu autenticación
            </Title>

            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt="QR Code"
                style={{
                  maxWidth: "220px",
                  width: "100%",
                  margin: "0 auto",
                  display: "block",
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              />
            )}

            {manualCode && (
              <Paragraph copyable strong className="verificar-totp-manual">
                Código manual: {manualCode}
              </Paragraph>
            )}

            {instructions && (
              <Text className="verificar-totp-instructions">
                {instructions}
              </Text>
            )}

            <Title
              level={5}
              style={{ marginTop: "1rem" }}
              className="verificar-totp-step-title"
            >
              Paso 2: Ingresa el código generado por tu app
            </Title>

            <Input
              placeholder="Código TOTP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                type="primary"
                onClick={handleVerify}
                loading={loading}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  height: "50px",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  display: "inline-block",

                  // width: "100%",
                  // maxWidth: "300px", // Ancho máximo
                  // height: "50px", // Más alto
                  // fontSize: "1.15rem", // Texto más grande
                  // fontWeight: 600, // Más grueso
                  // borderRadius: "12px", // Opcional: bordes más suaves
                }}
              >
                Verificar
              </Button>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default VerificarTotpPage;
