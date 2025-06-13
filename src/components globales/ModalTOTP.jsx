import React, { useState } from 'react';
import { Modal, Input, Typography } from 'antd';

const { Title, Text } = Typography;

const ModalTOTP = ({ visible, onClose, onConfirm, usuarioDestino, monto }) => {
  const [totp, setTotp] = useState('');

  const handleOk = () => {
    if (!totp) return;
    onConfirm(totp);
    setTotp('');
    onClose();
  };

  const handleCancel = () => {
    setTotp('');
    onClose();
  };

  return (
    <Modal
      title='¡Ya casi!'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText='Confirmar'
      cancelText='Cancelar'
    >
      <Text>
        Vas a transferir <strong>${monto}</strong> a{' '}
        <strong>{usuarioDestino.name}</strong>
      </Text>

      <div style={{ marginTop: 20 }}>
        <h5 className='title-h5'>Código TOTP</h5>
        <Input.OTP
          placeholder='Ingresa el código de autenticación'
          value={totp}
          onChange={setTotp}
        />
      </div>
    </Modal>
  );
};

export default ModalTOTP;
