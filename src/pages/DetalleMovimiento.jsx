import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Button } from 'antd';
import moment from 'moment';
import { HomeOutlined, CopyOutlined } from '@ant-design/icons';
import '../stilos/detalle.css';

const { Title, Text } = Typography;

const DetalleMovimiento = () => {
  const navigate = useNavigate();
  const { state: transaccion } = useLocation();

  if (!transaccion) {
    return <Text>No se encontró la transacción.</Text>;
  }

  const {
    id,
    amount,
    createdAt,
    fromUsername,
    fromName,
    toUsername,
    toName,
    type
  } = transaccion;

  const tipo =
    type === 'sent' ? 'TRANSFERENCIA ENVIADA' : 'TRANSFERENCIA RECIBIDA';
  const fecha = moment.unix(createdAt).format('DD/MM/YYYY HH:mm');
  const esEnvio = type === 'sent';
  const monto = `R$ ${Math.abs(amount)}`;

  return (
    <div className='dashboard-container'>
      <h1 className='title-h1'>RauloCoins</h1>
      <Card className='dellate-container' bodyStyle={{ height: 300 }}>
        <div className="titulo-home">
          <h3 className='title-h3'>{tipo}</h3>
            <div className='contenedor-button'>
              <Button
                color='default'
                variant='outlined'
                icon={<HomeOutlined />}
                iconPosition='end'
                onClick={() => navigate('/dashboard')}
              >
              </Button>
            </div>
        </div>

        {/* Contenido alineado a la izquierda */}
        <div style={{ textAlign: 'left' }} className='info-transferencia'>
          <Text className='margin-bottom'>
            <strong>ID Transacción:</strong> {id}
          </Text>
          <Text>
            <strong>Fecha:</strong> {fecha}
          </Text>
          <Text
            copyable={{
              text: fromUsername,
              tooltips: `${fromUsername}`,
              icon: <CopyOutlined style={{ color: 'black' }} />
            }}
          >
            <strong>Desde:</strong> {fromName}
          </Text>
          <Text
            copyable={{
              text: toUsername,
              tooltips: `${toUsername}`,
              icon: <CopyOutlined style={{ color: 'black' }} />
            }}
          >
            <strong>A:</strong> {toName}
          </Text>

          {transaccion.description && (
            <Text strong>
              Descripción:{" "}
              <span style={{ fontStyle: 'italic', fontWeight: 'normal' }}>
                {transaccion.description}
              </span>
            </Text>
          )}
        </div>

        {/* Contenido centrado */}
        <div
          className={`valor-transferencia ${esEnvio ? 'enviada' : 'recibida'}`}
        >
          <h3 className='title-h3' style={{ fontWeight: 'normal', margin: 0 }}>
            {esEnvio ? 'Enviaste' : 'Recibiste'}:{' '}
            <span
              style={{ color: esEnvio ? 'red' : 'green', fontWeight: 'bold' }}
            >
              {monto}
            </span>
          </h3>
        </div>

        <br />
        <br />
      </Card>
    </div>
  );
};

export default DetalleMovimiento;
