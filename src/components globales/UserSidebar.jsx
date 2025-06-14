import "./UserSidebar.css";

export const UserSidebar = ({ user }) => {
  return (
    <div className="user-sidebar-card">
      <div className="user-sidebar-header">
        <p className="user-sidebar-name">{user.name}</p>
        <p className="user-sidebar-email">{user.email}</p>
      </div>
      <div className="user-sidebar-info">
        <p>
          <span className="user-sidebar-label">Tu Balance</span>: {user.balance}
        </p>
        <p>
          <span className="user-sidebar-label">Alias</span>: {user.alias}
        </p>
      </div>
      <button className="user-sidebar-btn">← Volver a Inicio</button>
    </div>
  );
};

// aca faltaria traner los datos de la db
