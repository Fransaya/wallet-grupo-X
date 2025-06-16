import { useState, useEffect } from "react";
import { TransferCard } from "../components globales/TransferCard";
import { UserSidebar } from "../components globales/UserSidebar";
import { Input } from "antd";
import { SearchOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transfers, setTransfers] = useState([]);

  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let filtered = transferencias_hardcod;

  //   // Aplicar filtro por tipo
  //   if (filter !== "todos") {
  //     filtered = filtered.filter((t) => t.type.toLowerCase() === filter.toLowerCase());
  //   }

  //   // Aplicar búsqueda
  //   if (searchTerm) {
  //     const searchLower = searchTerm.toLowerCase();
  //     filtered = filtered.filter(
  //       (t) =>
  //         t.name.toLowerCase().includes(searchLower) ||
  //         t.date.toLowerCase().includes(searchLower) ||
  //         t.amount.toLowerCase().includes(searchLower)
  //     );
  //   }

  //   setFilteredTransfers(filtered);
  // }, [filter, searchTerm]);
useEffect(() => {
  const fetchUser = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser).user;
        setUser(parsedUser || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setUser(null);
    }
  };

  fetchUser();
}, []);

useEffect(() => {
  const fetchTransfers = () => {
    try {
      const storedTransfer = sessionStorage.getItem("transactions");
      if (storedTransfer) {
        const parsedTransfer = JSON.parse(storedTransfer);
        setTransfers(Array.isArray(parsedTransfer) ? parsedTransfer : []);
      } else {
        setTransfers([]);
      }
    } catch (error) {
      console.error("Error al obtener transferencias:", error);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchTransfers();
}, []);


  // Aplicar filtros y búsqueda
  useEffect(() => {
    let filtered = [...transfers];

    // Filtro por tipo
    if (filter !== "todos") {
      const tipo = filter === "enviada" ? "sent" : "received" ;
      filtered = filtered.filter((t) => t.type?.toLowerCase() === tipo);
    }

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      filtered = filtered.filter((t) => {
        const name = t.name?.toLowerCase() || "";
        const date = String(t.date || "").toLowerCase();
        const amount = String(t.amount ?? "");

        return (
          name.includes(searchLower) ||
          date.includes(searchLower) ||
          amount.includes(searchLower)
        );
      });
    }

    setFilteredTransfers(filtered);
  }, [filter, searchTerm, transfers]);

  // if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="historial-bg">
      <div className="historial-layout">
        <div className="historial-main">
          <div className="historial-header">
            <div className="historial-title-container">
              <h2 className="historial-title">
                Historial de Transferencias
                <span className="historial-title-icon">↔</span>
              </h2>
            </div>
            <button 
              className="historial-back-btn"
              onClick={() => navigate("/dashboard")}
            >
              <HomeOutlined />
              Volver al Inicio
            </button>
          </div>

          <div className="historial-filters">
            <button
              className={`historial-filter-btn ${filter === "todos" ? "active" : ""}`}
              onClick={() => setFilter("todos")}
            >
              Todos
            </button>
            <button
              className={`historial-filter-btn ${filter === "enviada" ? "active" : ""}`}
              onClick={() => setFilter("enviada")}
            >
              Enviadas
            </button>
            <button
              className={`historial-filter-btn ${filter === "recibida" ? "active" : ""}`}
              onClick={() => setFilter("recibida")}
            >
              Recibidas
            </button>
          </div>

          <div className="historial-search">
            <Input
              placeholder="Buscar por nombre, fecha o monto..."
              prefix={<SearchOutlined style={{ color: "#7b68ee" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>

          <div className="historial-list">
            {filteredTransfers.length > 0 ? (
              filteredTransfers.map((t) => (
                <TransferCard key={t.id} transfer={t} />
              ))
            ) : (
              <div className="historial-empty">
                No se encontraron transferencias
              </div>
            )}
          </div>
        </div>
        <UserSidebar user={user} />
      </div>
    </div>
  );
}
