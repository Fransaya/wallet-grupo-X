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
  const [visibleCount, setVisibleCount] = useState(3);
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

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    sessionStorage.clear();
    navigate("/sesion/login");
  };

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
        <div className="dashboard-top-bar">
          <Button
            type="default"
            color="danger"
            variant="filled"
            onClick={handleLogout}
            icon={<LogoutOutlined style={{ color: "BB0A21" }} />}
            iconPosition="end"
          >
            Cerrar Sesion
          </Button>
        </div>
        <div className="dashboard-header">
          <p className="title-h1">
            Hola <strong>{data.name}.</strong> Bienvenido
          </p>
          <div className="img-profile">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile avatar"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          </div>
        </div>

        <div className="dashboard-card-container">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h6 className="title-h6">
                Tu Balance <EyeFilled style={{ color: "#BB0A21" }} />
              </h6>
            </div>

            <div className="dashboard-balance">
              <h1 className="title-h1-balance" style={{ margin: "0" }}>
                <LuWallet style={{ color: "#1677ff", fontSize: "32px" }} />
                {data ? `${data.balance}` : "Cargando..."}
              </h1>
            </div>

            <div className="dashboard-actions">
              <Space size="middle">
                <div className="send-transfer" onClick={handleTransferir}>
                  <span className="circle-btn">
                    <span className="circle-inner">
                      <FiArrowUp />
                    </span>
                  </span>
                  Transferir
                </div>

                <div className="go-profile" onClick={handleDatos}>
                  <span className="circle-btn">
                    <span className="circle-inner">
                      <FiUser />
                    </span>
                  </span>
                  Ver Perfil
                </div>
              </Space>
            </div>
          </div>
        </div>

        <div
          className="dashboard-card"
          style={{ marginTop: "30px" }}
          bodyStyle={{ padding: "12px" }}
        >
          <div className="dashboard-card-header">
            <h6 className="title-h6" strong>
              Historial de transferencias{" "}
            </h6>
          </div>
          <hr />

          <List
            itemLayout="horizontal"
            dataSource={transactions.slice(0, visibleCount)}
            renderItem={(item) => {
              const isReceived = item.type === "received";
              const icon = isReceived ? (
                <FiArrowRightCircle style={{ color: "green" }} />
              ) : (
                <FiArrowLeftCircle style={{ color: "red" }} />
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
                    title={`${user}`}
                    description={
                      <>
                        <div>{fecha}</div>
                      </>
                    }
                  />
                  <Text
                    strong
                    style={{ color: item.type === "sent" ? "red" : "green" }}
                  >
                    <span className="transaction-amount">
                      {" "}
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
