import { FaArrowDown, FaQrcode, FaDownload } from "react-icons/fa";

export const TransferCard = ({ transfer }) => {
  const esta_enviada = transfer.type === 'Enviada';

  // faltan funciones de descargar comprobantes

  return (
    <div className="flex justify-between items-center border-b border-gray-700 py-4 text-gray-200">
      <div>
        <p className="font-semibold text-base text-white">{transfer.name}</p>
        <p className="text-sm text-gray-400">{transfer.date}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <p className="text-base font-semibold">{transfer.amount}</p>
          <p className="text-sm text-gray-400">{transfer.type}</p>
        </div>

        <FaArrowDown
          className={`text-xl ${esta_enviada ? "rotate-0 text-red-500" : "rotate-180 text-green-500"}`}
        />
        <FaQrcode className="text-lg text-gray-700 cursor-pointer" />
        <FaDownload className="text-lg text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};
