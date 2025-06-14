import { ArrowUpOutlined, ArrowDownOutlined, QrcodeOutlined, DownloadOutlined } from "@ant-design/icons";
import "./TransferCard.css";

export function TransferCard({ transfer }) {
  const isEnviada = transfer.type === "Enviada";
  const isRecibida = transfer.type === "Recibida";

  // faltan funciones de descargar comprobantes

  return (
    <div className={`transfer-card ${transfer.type.toLowerCase()}`}>
      <div className="transfer-card-info">
        <h4 className="transfer-card-name">{transfer.name}</h4>
        <span className="transfer-card-date">{transfer.date}</span>
      </div>

      <div className="transfer-card-actions">
        <div className="transfer-card-amount-type">
          <span className="transfer-card-amount">{transfer.amount}</span>
          <span className="transfer-card-type">{transfer.type}</span>
        </div>

        <div className="transfer-card-icons">
          {isEnviada && (
            <span className="transfer-card-icon enviada-icon">
              <ArrowUpOutlined />
            </span>
          )}
          {isRecibida && (
            <span className="transfer-card-icon recibida-icon">
              <ArrowDownOutlined />
            </span>
          )}
          <span className="transfer-card-icon qr" title="Ver QR">
            <QrcodeOutlined />
          </span>
          <span className="transfer-card-icon download" title="Descargar comprobante">
            <DownloadOutlined />
          </span>
        </div>
      </div>
    </div>
  );
}
