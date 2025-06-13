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
