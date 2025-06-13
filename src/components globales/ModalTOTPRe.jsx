import React, { useState } from 'react';
import { Modal, Input, Typography, Image, message } from 'antd';
import axios from 'axios';
import Endpoints from '../API/Endpoints';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const ModalTOTPRe = ({ visible, onClose, username, totpSetup, onSuccess }) => {
  const [totp, setTotp] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState('');

  const navigate = useNavigate();

  const handleOk = async () => {
    if (!totp) return;

    try {
      setLoading(true);
      const config = {
        method: 'POST',
        url: Endpoints.getUrl(Endpoints.SESION.VERIFICAR),
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          username,
          totpToken: totp
        }
      }
      const response = await axios(config);

      const loginConfig = {
        method: 'POST',
        url: Endpoints.getUrl(Endpoints.SESION.LOGIN),
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username: username,
          totpToken: totp
        },
      };

      const loginRespose = await axios(loginConfig);
      setData(loginRespose)

      sessionStorage.setItem('token', loginRespose.data.success);
      sessionStorage.setItem('user', JSON.stringify(loginRespose.data));

      if (response.data.success) {
        message.success(response.data.message);
        onSuccess(response.data);
        onClose();
        navigate('/dashboard')
      } else {
        message.error(response.data.message || 'Error en la verificación');
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || 'No se pudo verificar el TOTP'
      );
    } finally {
      setTotp('');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTotp('');
    onClose();
  };

  return (
    <Modal
      title="Verificación de autenticación de dos factores"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Verificar"
      cancelText="Cancelar"
      confirmLoading={loading}
    >
      <Text>
        Escaneá el siguiente código QR con tu app de autenticación (como Google Authenticator), o ingresá el código manual. Y luego ingresa el código TOTP generado por la app.
      </Text>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <Image
          src={totpSetup?.qrCodeUrl}
          alt="Código QR"
          width={200}
          preview={false}
        />
        <div style={{ marginTop: 10 }}>
          <Text type="secondary">Código manual:</Text>
          <br />
        <Text strong>{totpSetup?.manualSetupCode}</Text>
        </div>
      </div>

      <h5 className='title-h5'>Código TOTP</h5>
      <Input.OTP
        placeholder="Ingresa el código de 6 dígitos"
        value={totp}
        onChange={setTotp}
        autoFocus
      />
    </Modal>
  );
};

export default ModalTOTPRe;