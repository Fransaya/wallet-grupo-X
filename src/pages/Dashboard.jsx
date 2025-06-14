import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Space, List, Avatar } from "antd";
import "../stilos/dasboard.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  LogoutOutlined,
  WalletOutlined,
  DollarOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  EyeFilled,
} from "@ant-design/icons";

import { LuWallet } from "react-icons/lu";
import { FiArrowRightCircle } from "react-icons/fi";
import { FiArrowLeftCircle } from "react-icons/fi";
import { FiArrowUp, FiArrowDown, FiUser } from "react-icons/fi";
import { FiBookOpen } from "react-icons/fi";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [data, setData] = useState(null); // null por defecto
  const [transactions, setTransactions] = useState([]);
  const [visibleCount] = useState(3); // Solo lectura
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const storedUser = sessionStorage.getItem("user") || {};
    const storedTransactions = sessionStorage.getItem("transactions");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoading(false);
        setData(parsedUser);

        console.log("Datos del usuario:", parsedUser);
      } catch (error) {
        console.error("Error al parsear los datos del usuario:", error);
      }
    }

    if (storedTransactions) {
      try {
        const parsedTx = JSON.parse(storedTransactions);
        setTransactions(parsedTx);
      } catch (error) {
        console.error("Error al parsear las transacciones:", error);
      }
    }
  }, []);

  const handleTransferir = () => {
    navigate("/transferir");
  };

  const handleDatos = () => {
    navigate(`/datos-user/${data.name}`, { state: data });
  };

  const handleVerMas = () => {
    navigate("/historial");
  };

  return (
    (loading && (
      <div className="loading-container">
        <Title level={2}>Cargando...</Title>
      </div>
    )) || (
      <div className="dashboard-container">
        {/* Fila superior: saludo y avatar */}
        <div className="dashboard-row-top">
          <div className="dashboard-greeting-block">
            <h1 className="title-h1 dashboard-greeting-title">
              👋 Hola <span style={{ color: "#fff" }}>{data.name}</span>
            </h1>
            <p className="dashboard-greeting-sub">Bienvenido a tu billetera</p>
          </div>
          <div className="dashboard-avatar-block">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile avatar"
              className="dashboard-avatar-img"
            />
          </div>
        </div>

        {/* Card de balance y acciones */}
        <div className="dashboard-card-balance">
          <div className="dashboard-balance-block">
            <h2 className="dashboard-balance-title">
              <LuWallet
                style={{
                  color: "#00bcd4",
                  fontSize: "2.2rem",
                  marginRight: 10,
                }}
              />
              {data ? `${data.balance}` : "Cargando..."}
            </h2>
            <span className="dashboard-balance-label">Tu balance</span>
          </div>
          <div className="dashboard-actions-block">
            <Button className="dashboard-action-btn" onClick={handleTransferir}>
              <FiArrowUp style={{ marginRight: 8 }} /> Transferir
            </Button>
            <Button className="dashboard-action-btn" onClick={handleDatos}>
              <FiUser style={{ marginRight: 8 }} /> Ver Perfil
            </Button>
          </div>
        </div>

        {/* Card de historial */}
        <div className="dashboard-history-container">
          <div className="dashboard-history-header dashboard-card-header">
            <h6 className="title-h6" strong>
              Historial de transferencias
            </h6>
          </div>
          <hr />
          <List
            className="dashboard-history-list"
            itemLayout="horizontal"
            dataSource={transactions.slice(0, visibleCount)}
            renderItem={(item) => {
              const isReceived = item.type === "received";
              const icon = isReceived ? (
                <FiArrowRightCircle style={{ color: "#22c55e" }} />
              ) : (
                <FiArrowLeftCircle style={{ color: "#ef4444" }} />
              );
              const user = isReceived ? item.fromName : item.toName;
              const label = isReceived ? "Recibida" : "Enviada";
              const fecha = moment
                .unix(item.createdAt)
                .format("DD/MM/YYYY HH:mm");
              return (
                <List.Item
                  onClick={() =>
                    navigate("/detalle-transacciones", { state: item })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <List.Item.Meta
                    title={
                      <span className="dashboard-history-list-title">
                        {user}
                      </span>
                    }
                    description={
                      <span className="dashboard-history-list-desc">
                        {fecha}
                      </span>
                    }
                  />
                  <Text strong>
                    <span className="transaction-amount">
                      {isReceived ? "+" : "-"} R$ {Math.abs(item.amount)}
                    </span>
                    <div className="transaction-icon-text">
                      <i
                        className="icon-transaction"
                        style={{ marginRight: 2, fontSize: 25 }}
                      >
                        {icon}
                      </i>
                      <p className="p-transaction">{label}</p>
                    </div>
                  </Text>
                </List.Item>
              );
            }}
          />
          <div
            style={{
              textAlign: "end",
              marginTop: 12,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {visibleCount < transactions.length && (
              <Button
                className="btn-see-historial"
                type="button"
                onClick={handleVerMas}
              >
                <FiBookOpen style={{ marginRight: 8 }} />
                Ver Historial
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
