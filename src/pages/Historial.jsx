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
  balance: 45,
};

export default function Historial() {
  return (
    <div className="historial-bg">
      <div className="historial-layout">
        <div className="historial-main">
          <h2 className="historial-title">
            Historial de Transferencias
            <span className="historial-title-icon">↔</span>
          </h2>
          <div className="historial-list">
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
