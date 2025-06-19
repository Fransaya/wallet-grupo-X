import React, { useState } from "react";
import {
  Typography,
  Select,
  Input,
  Button,
  Card,
  Space,
  message,
  notification,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { buscarUsuarios } from "../fetchs/transferenciaService";
import axios from "axios";
import ModalTOTP from "../components globales/ModalTOTP";
import "../stilos/transferir.css";
import Endpoints from "../API/Endpoints";

const { Title } = Typography;
const { Option } = Select;

const Transferir = () => {
  const navigate = useNavigate();

  const [aliasSeleccionado, setAliasSeleccionado] = useState("");
  const [monto, setMonto] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioDestino, setUsuarioDestino] = useState("");
  const [descripcion, setDescripcion] = useState("Varios");
  const [loadingConfirmacion, setLoadingConfirmacion] = useState(false);

  const handleTransferencia = () => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      alert("No se encontró la información del usuario actual.");
      return;
    }

    const usuarioActual = JSON.parse(userData);

    if (!usuarioDestino || !monto) {
      return message.warning("Por favor, completa todos los campos.");
    }

    if (usuarioDestino.username === usuarioActual.user.username) {
      return message.warning("No puedes transferirte a vos mismo.");
    }

    if (parseFloat(monto) <= 0) {
      return message.warning("El monto debe ser mayor a cero.");
    }

    if (parseFloat(monto) > usuarioActual.user.balance) {
      return message.warning(
        "No tienes saldo suficiente para realizar esta transferencia."
      );
    }

    // Solo mostrar el modal
    setMostrarModal(true); // Mostramos el modal TOTP
  };

  const transferirRaulocoins = async ({
    fromUsername,
    toUsername,
    amount,
    description,
    operationToken,
  }) => {
    const config = {
      method: "POST",
      url: Endpoints.getUrl(Endpoints.TRANSFERENCIA.TRANSFERIR),
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        fromUsername,
        toUsername,
        amount,
        description,
        operationToken,
      },
    };

    const response = await axios(config);

    const historialConfig = {
      method: "POST",
      url: Endpoints.getUrl(Endpoints.TRANSFERENCIA.HISTORIAL),
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: fromUsername,
        totpToken: operationToken,
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

    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        response.data?.message || "Error al realizar la transferencia"
      );
    }

    return response.data;
  };

  const handleConfirmarTotp = async (totp) => {
    const userData = sessionStorage.getItem("user");

    if (!userData) {
      message.error("No se encontró información del usuario actual.");
      return;
    }

    const usuarioActual = JSON.parse(userData);

    setLoadingConfirmacion(true);

    try {
      const resultado = await transferirRaulocoins({
        fromUsername: usuarioActual.user.username,
        toUsername: usuarioDestino.username,
        amount: parseFloat(monto),
        description: descripcion,
        operationToken: totp,
      });

      notification.success({
        message: "Transferencia exitosa",
        description: resultado.message,
        placement: "topRight",
      });

      // Actualizar el usuario en sessionStorage con el nuevo balance
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...usuarioActual,
          user: {
            ...usuarioActual.user,
            balance: resultado.transfer.from.newBalance,
          },
        })
      );

      // Reset de estado
      setMonto("");
      setDescripcion("");
      setUsuarioDestino("");
      setAliasSeleccionado("");
      setOpciones([]);

      return true;
    } catch (error) {
      notification.error({
        message: "Error en la transferencia",
        description: error.message,
        placement: "topRight",
      });

      return false;
    } finally {
      setLoadingConfirmacion(false);
    }
  };

  const handleBuscarUsuarios = async (valor) => {
    if (valor.length < 3) {
      setOpciones([]);
      return;
    }

    setLoading(true);
    const resultados = await buscarUsuarios(valor);
    setOpciones(resultados);
    setLoading(false);
  };

  return (
    <div className="transferir-container">
      <div className="page-header">
        <div className="page-title-container">
          <h1 className="title-h1 transferir-title-main">Transferir</h1>
        </div>
        <button 
          className="back-home-btn"
          onClick={() => navigate("/dashboard")}
        >
          <HomeOutlined />
          Volver al Inicio
        </button>
      </div>
      {loadingConfirmacion ? (
        <div className="loading-container">
          <Spin size="large" tip="Procesando transferencia..." />
        </div>
      ) : (
        <div className="transferir-card">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <h5 className="title-h5">Alias</h5>
              <Select
                showSearch
                placeholder="Buscar alias"
                onSearch={handleBuscarUsuarios}
                onChange={(value) => {
                  const user = opciones.find((u) => u.username === value);
                  setUsuarioDestino(user);
                  setAliasSeleccionado(value);
                }}
                value={aliasSeleccionado}
                loading={loading}
                style={{ width: "100%" }}
                filterOption={false}
                notFoundContent={
                  loading ? <p style={{ color: "white" }}>Buscando... </p> : <p style={{ color: "white" }}>No se encontraron resultados</p>
                }
              >
                {opciones.map((user) => (
                  <Option key={user.username} value={user.username}>
                    {user.username}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
          <h5 className="title-h5">Monto</h5>
          <Input
            type="text"
            placeholder="Monto a transferir"
            value={monto}
            onChange={(e) => {
              const value = e.target.value;

              
              if (/^\d*$/.test(value)) {
                setMonto(value);
              }
            }}
            inputMode="numeric" 
            pattern="\d*"
          />
          
        </div>

            <div>
              <h5 className="title-h5">Descripción</h5>
              <Input
                type="text"
                placeholder="Descripción de la transferencia"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <Button type="primary" block onClick={handleTransferencia}>
              Transferir
            </Button>
          </Space>
        </div>
      )}
      <ModalTOTP
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={handleConfirmarTotp}
        usuarioDestino={usuarioDestino || {}}
        monto={monto}
      />
    </div>
  );
};

export default Transferir;
