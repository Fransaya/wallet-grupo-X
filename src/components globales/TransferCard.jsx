import { FaArrowDown, FaQrcode, FaDownload } from "react-icons/fa";

export const TransferCard = ({ transfer }) => {
  const esta_enviada = transfer.type === "Enviada";

  // faltan funciones de descargar comprobantes

  return (
    <div className={`transfer-card ${esta_enviada ? "enviada" : "recibida"}`}>
      <div className="transfer-card-info">
        <p className="transfer-card-name">{transfer.name}</p>
        <p className="transfer-card-date">{transfer.date}</p>
      </div>
      <div className="transfer-card-actions">
        <div className="transfer-card-amount-type">
          <p className="transfer-card-amount">{transfer.amount}</p>
          <p className="transfer-card-type">{transfer.type}</p>
        </div>
        <FaArrowDown
          className={`transfer-card-icon ${
            esta_enviada ? "enviada-icon" : "recibida-icon"
          }`}
        />
        <FaQrcode className="transfer-card-icon qr" />
        <FaDownload className="transfer-card-icon download" />
      </div>
    </div>
  );
};
