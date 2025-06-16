const BASE_URL = "https://raulocoin.onrender.com/api";

const SESION = {
  LOGIN: "user-details",
  REGISTER: "register",
  RECUPERAR: "regenerate-totp",
  VERIFICAR: "verify-totp-setup",
  AUTH0_AUTHENTICATE: "auth0/authenticate",
};

const TRANSFERENCIA = {
  BUSCARALIAS: "search-users",
  TRANSFERIR: "transfer",
  HISTORIAL: "transactions",
  HISTORIALAUTH: "auth0/transactions",
};

const PERFIL = {
  EDITAR: "auth0/edit-profile",
  BALANCE: "auth0/balance",

};

const getUrl = (endpoint) => `${BASE_URL}/${endpoint}`;

export default { BASE_URL, SESION, getUrl, TRANSFERENCIA, PERFIL };
