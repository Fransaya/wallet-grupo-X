import { ArrowUpOutlined, ArrowDownOutlined, QrcodeOutlined, DownloadOutlined } from "@ant-design/icons";
import "./TransferCard.css";
import { jsPDF } from "jspdf";


export function TransferCard({ transfer }) {
 console.log("TransferCard renderizado con transfer:", transfer);
  const isEnviada = transfer.type === "sent";
  const isRecibida = transfer.type === "award" || transfer.type === "received";

  // faltan funciones de descargar comprobantes
  const handleDownloadPDF = (transfer) => {
  const doc = new jsPDF();

  const tipo =
    transfer.type === "sent" ? "TRANSFERENCIA ENVIADA" : "TRANSFERENCIA RECIBIDA";

  const fecha = new Date(transfer.createdAt * 1000).toLocaleString();
  const monto = `R$ ${Math.abs(transfer.amount)}`;

  // Estilos base
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RAULOCOINS - COMPROBANTE DE TRANSACCIÓN", 105, 20, { align: "center" });

  doc.setDrawColor(200);
  doc.line(20, 25, 190, 25); // línea horizontal

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  let y = 35;
  const salto = 8;

  const printRow = (label, value) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", 80, y);
    y += salto;
  };

  printRow("Tipo de transacción", tipo);
  printRow("Fecha", fecha);
  printRow("ID", transfer.id || "N/A");

  doc.line(20, y + 2, 190, y + 2);
  y += 10;

  printRow("Usuario Origen", `${transfer.fromUsername || "-"} (${transfer.fromName || "-"})`);
  printRow("Usuario Destino", `${transfer.toUsername || "-"} (${transfer.toName || "-"})`);
  printRow("Monto", monto);

  doc.line(20, y + 2, 190, y + 2);
  y += 15;

  doc.setFont("helvetica", "italic");
  doc.setTextColor(100);
  doc.text("Gracias por utilizar Raulocoins", 20, y);

  doc.save(`comprobante-${transfer.id || "transaccion"}.pdf`);
};


  


  return (
    <div className={`transfer-card ${transfer.type.toLowerCase()}`} 
     
    >
      <div className="transfer-card-info">
        <h4 className="transfer-card-name">{transfer.toName}</h4>
       <span className="transfer-card-date">
        {new Date(transfer.createdAt * 1000).toLocaleDateString("es-AR")}
      </span>
        <span className="transfer-card-username">{transfer.toUsername}</span>

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
          <span className="transfer-card-icon download" title="Descargar comprobante"  
          onClick={(e) => {
            e.stopPropagation(); // evita navegación si está dentro de una tarjeta
            handleDownloadPDF(transfer);
          }}>
            <DownloadOutlined />
          </span>
        </div>
      </div>
    </div>
  );
}
