import { TransferCard } from "../components globales/TransferCard";
import { UserSidebar } from "../components globales/UserSidebar";



const transferencias_hardcod = [
  {
    id: "1",
    name: "Tobias Requena",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Enviada",
  },
  {
    id: "2",
    name: "Julian Gomez",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Recibida",
  },
  {
    id: "3",
    name: "Francisco Prueba",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Enviada",
  },
  {
    id: "4",
    name: "Tobias Requena",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Enviada",
  },

  {
    id: "5",
    name: "Julian Gomez",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Recibida",
  },
  {
    id: "6",
    name: "Francisco Prueba",
    date: "31/05/2025 15:00",
    amount: "10$R",
    type: "Enviada",
  },
];

const user_hardcod = {
    id: "1",
    name: "Tobias Requena",
    email: "tobias.requena@prueba.com",
    alias: "tobias.alias",
    balance: 45
    
}

export default function Historial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-4 md:p-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
            Historial de Transferencias
            <span className="rotate-45 text-lg">↔</span>
          </h2>
          <div className="bg-white rounded-lg shadow p-4 divide-y">
            {transferencias_hardcod.map((t) => (
              <TransferCard key={t.id} transfer={t} />
            ))}
          </div>
        </div>

        <UserSidebar user={user_hardcod} />
      </div>
    </div>
  );
}
