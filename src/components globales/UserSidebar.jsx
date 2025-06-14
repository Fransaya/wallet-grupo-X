export const UserSidebar = ({user}) => {
  return (
    <div className="dark-card p-6 w-full max-w-sm">
      <div className="text-right text-sm text-gray-300">
        <p>{user.name}</p>
        <p className="text-xs">{user.email}</p>
      </div>

      <div className="mt-6 text-sm space-y-2">
        <p>
          <span className="text-blue-500 font-semibold">Tu Balance</span>: {user.balance}
        </p>
        <p>
          <span className="text-blue-500 font-semibold">Alias</span>: {user.alias}
        </p>
      </div>

      <button className="dark-button mt-8">
        ← Volver a Inicio
      </button>
    </div>
  );
};

// aca faltaria traner los datos de la db