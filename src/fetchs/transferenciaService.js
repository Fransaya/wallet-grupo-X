// src/api/transferenciaService.js
import axios from 'axios';
import endpoints from '../API/Endpoints';

export const buscarUsuarios = async (termino) => {
  if (termino.length < 3) return [];

  try {
    const url = endpoints.getUrl(endpoints.TRANSFERENCIA.BUSCARALIAS);
    const response = await axios.get(`${url}?q=${termino}`);

    if (response.data.success) {
      return response.data.users;
    }

    return [];
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    return [];
  }
};

export const transferencias = async (userId) => {
  try {
    const userId = userId || JSON.parse(sessionStorage.getItem('user')).user.id;
    if (!userId) {
      console.error('User ID is required to fetch transfers');
      return [];
    }
    const url = endpoints.getUrl(endpoints.TRANSFERENCIA.HISTORIALAUTH);
    const response = await axios.get(`${url}?userId=${userId}`);

    if (response.data.success) {
      return response.data.transfers;
    }

    return [];
  } catch (error) {
    console.error('Error al obtener transferencias:', error);
    return [];
  }
}
