import { FaArrowDown, FaQrcode, FaDownload } from "react-icons/fa";

export const TransferCard = ({ transfer }) => {
  const esta_enviada = transfer.type === 'Enviada';

  // faltan funciones de descargar comprobantes

  return (
    <div className="flex justify-between items-center border-b py-4">
      <div>
        <p className="font-semibold text-sm">{transfer.name}</p>
        <p className="text-xs text-gray-500">{transfer.date}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <p className="text-sm">{transfer.amount}</p>
          <p className="text-xs text-gray-500">{transfer.type}</p>
        </div>

        <FaArrowDown
          className={`text-lg ${esta_enviada ? "rotate-0 text-gray-700" : "rotate-180 text-green-600"}`}
        />
        <FaQrcode className="text-lg text-gray-700 cursor-pointer" />
        <FaDownload className="text-lg text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};
