// frontend/src/services/api.js

const API_URL = "http://localhost:8000/api"; 

export const saveToHistory = async (data) => {
  try {
    const response = await fetch(`${API_URL}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al guardar en el servidor');
    return await response.json();
  } catch (error) {
    console.error("Error en saveToHistory:", error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await fetch(`${API_URL}/history`);
    if (!response.ok) throw new Error('Error al obtener el historial');
    return await response.json();
  } catch (error) {
    console.error("Error en getHistory:", error);
    return [];
  }
};

export const deleteFromHistory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/history/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al borrar el registro');
    return await response.json();
  } catch (error) {
    console.error("Error en deleteFromHistory:", error);
    throw error;
  }
};