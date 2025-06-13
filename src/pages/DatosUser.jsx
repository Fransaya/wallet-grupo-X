import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Avatar,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  HomeOutlined,
  CopyOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../stilos/datos.css";
import axios from "axios";
import Endpoints from "../API/Endpoints";

const { Title, Text } = Typography;

const DatosUser = () => {
  const [user, setUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log("storedUser", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error(
          "Error al parsear el usuario desde sessionStorage:",
          error
        );
      }
    }
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Text>Cargando datos del usuario...</Text>
      </div>
    );
  }

  const handleRoute = (route) => {
    navigate(route);
  };

  // Abrir modal y setear valores iniciales
  const openEditModal = () => {
    form.setFieldsValue({
      email: user.email,
      name: user.name,
      username: user.username,
    });
    setEditModalOpen(true);
  };

  // Enviar datos editados a la API
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      setEditLoading(true);

      const preUserUpdated = user;

      const editConfit = {
        method: "POST",
        url: Endpoints.getUrl(Endpoints.PERFIL.EDITAR),
        headers: {
          "Content-Type": "application/json",
          // Si necesitas token de autenticación, agrégalo aquí
        },
        data: {
          email: values.email,
          name: values.name,
          username: values.username,
        },
      };

      const response = await axios.post(editConfit.url, editConfit.data, {
        headers: editConfit.headers,
      });

      console.log("response", response);

      const { data } = response;
      if (!data.success) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedUser = { ...preUserUpdated, ...data.user };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("Perfil actualizado correctamente");
      setEditModalOpen(false);
    } catch (error) {
      message.error(error.message || "No se pudo actualizar el perfil");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="dashboard-container user-profile-bg">
      <div className="user-profile-wrapper">
        <div className="dashboard-header">
          <h1 className="title-h1">Perfil de {user.name}</h1>
        </div>

        <Card
          className="datos-container user-profile-card"
          bodyStyle={{ padding: "0px" }}
          bordered={false}
        >
          <div className="user-profile-header">
            <Avatar size={80} icon={<UserOutlined />} />
            <div
              style={{
                marginLeft: 24,
                width: "100%",
                gap: 20,
                alignItems: "center",
                display: "flex",
              }}
            >
              <Text
                copyable={{
                  text: user.username,
                  tooltips: `${user.username}`,
                  icon: <CopyOutlined style={{ color: "black" }} />,
                }}
                type="secondary"
                style={{ fontSize: 38 }}
              >
                @{user.username}
              </Text>
              <Button
                onClick={() => handleRoute("/dashboard")}
                icon={<HomeOutlined />}
                size="large"
                style={{ height: 40, padding: "0 10px" }}
              ></Button>
            </div>
          </div>

          <div className="user-profile-info">
            <div>
              <UserOutlined style={{ marginRight: 8 }} />
              <Text strong>ID:</Text> <Text>{user.id}</Text>
            </div>
            <div>
              <MailOutlined style={{ marginRight: 8 }} />
              <Text strong>Email:</Text> <Text>{user.email}</Text>
            </div>
            <div>
              <TeamOutlined style={{ marginRight: 8 }} />
              <Text strong>Tipo de Usuario:</Text>{" "}
              <Tag color="blue">{user.userType}</Tag>
            </div>
            <div>
              <DollarOutlined style={{ marginRight: 8, color: "#1976d2" }} />
              <Text strong>Balance:</Text>{" "}
              <Text>${user.balance != null ? user.balance : 0}</Text>
            </div>
            <div>
              <CheckCircleOutlined
                style={{
                  marginRight: 8,
                  color: user.isVerified ? "green" : "red",
                }}
              />
              <Text strong>Cuenta Verificada:</Text>{" "}
              <Text>{user.isVerified ? "Sí" : "No"}</Text>
            </div>
            <div>
              <CheckCircleOutlined
                style={{
                  marginRight: 8,
                  color: user.totpVerified ? "green" : "red",
                }}
              />
              <Text strong>2FA Verificada:</Text>{" "}
              <Text>{user.totpVerified ? "Sí" : "No"}</Text>
            </div>
            <div>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              <Text strong>Cuenta creada el:</Text>{" "}
              <Text>
                {user.createdAt
                  ? moment.unix(user.createdAt).format("DD/MM/YYYY HH:mm")
                  : "N/A"}
              </Text>
            </div>
          </div>
          <div className="btn user-profile-btns">
            <Button
              className="btn-editar-perfil"
              icon={<EditOutlined />}
              size="large"
              style={{
                height: 40,
                padding: "0 10px",
                background: "#f0f0f0",
              }}
              onClick={openEditModal}
            >
              Editar perfil
            </Button>
            {/* <Button
              className="btn-editar-pass"
              onClick={() => navigate("/cambiar-password")}
              style={{
                marginRight: 16,
                backgroundColor: "#bb0a21",
                color: "white",
                border: "none",
                fontSize: 16,
                height: 40,
                padding: "0 10px",
              }}
              icon={<LockOutlined />}
              size="large"
            >
              Cambiar Contraseña
            </Button> */}
          </div>
        </Card>
      </div>

      {/* Modal para editar perfil */}
      <Modal
        title="Editar perfil"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleEditSubmit}
        confirmLoading={editLoading}
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            email: user.email,
            name: user.name,
            username: user.username,
          }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "El email es requerido" },
              { type: "email", message: "Ingrese un email válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: false },
              { min: 2, message: "El nombre debe tener al menos 2 caracteres" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nombre de usuario"
            name="username"
            rules={[
              { required: false },
              {
                min: 3,
                message: "El usuario debe tener al menos 3 caracteres",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DatosUser;
