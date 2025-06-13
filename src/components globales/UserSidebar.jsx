export const UserSidebar = ({user}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm">
      <div className="text-right text-sm text-gray-500">
        <p>{user.name}</p>
        <p className="text-xs">{user.email}</p>
      </div>
    
      <div className="mt-4 text-sm space-y-1">
        <p>
          <span className="text-blue-500 font-semibold">Tu Balance</span>: {user.balance}
        </p>
        <p>
          <span className="text-blue-500 font-semibold">Alias</span>: {user.alias}
        </p>
      </div>

      <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full w-full">
        ← Volver a Inicio
      </button>
    </div>
  );
};

// aca faltaria traner los datos de la db