import "./UserSidebar.css";
import { UserOutlined, DollarOutlined } from "@ant-design/icons";

export function UserSidebar({ user }) {
  return (
    <div className="user-sidebar">
      <div className="user-sidebar-header">
        <div className="user-sidebar-avatar">
          <UserOutlined style={{ fontSize: "2.5rem", color: "white" }} />
        </div>
        <h3 className="user-sidebar-name">{user.name}</h3>
        <p className="user-sidebar-email">{user.email}</p>
        <span className="user-sidebar-alias">@{user.alias}</span>
      </div>

      <div className="user-sidebar-balance">
        <div className="user-sidebar-balance-label">
          <DollarOutlined style={{ marginRight: "0.5em" }} />
          Balance Actual
        </div>
        <div className="user-sidebar-balance-amount">
          {user.balance}$R
        </div>
      </div>
    </div>
  );
}


