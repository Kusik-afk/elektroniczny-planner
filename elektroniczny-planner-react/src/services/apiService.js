// src/services/apiService.js

const API_BASE_URL = 'http://localhost:5000/api'; // Adres naszego backendu

// Funkcja pomocnicza do wykonywania żądań HTTP
const makeRequest = async (endpoint, method = 'GET', data = null, token = null, queryParams = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let url = `${API_BASE_URL}${endpoint}`;
  if (queryParams) {
    const queryString = new URLSearchParams(queryParams).toString();
    url += `?${queryString}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Próbujemy parsować błąd z odpowiedzi serwera
      const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd serwera' }));
      throw new Error(errorData.message || `Błąd HTTP: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Błąd w makeRequest:', error);
    throw error;
  }
};

// Funkcje autoryzacji
export const authService = {
  register: (email, password) => makeRequest('/auth/register', 'POST', { email, password }),
  login: (email, password) => makeRequest('/auth/login', 'POST', { email, password }),
};

// Funkcje do zarządzania zadaniami
export const taskService = {
  getTasks: (token, queryParams = null) => makeRequest('/tasks', 'GET', null, token, queryParams),
  createTask: (taskData, token) => makeRequest('/tasks', 'POST', taskData, token),
  updateTask: (id, taskData, token) => makeRequest(`/tasks/${id}`, 'PUT', taskData, token),
  deleteTask: (id, token) => makeRequest(`/tasks/${id}`, 'DELETE', null, token),
};

// Funkcje do zarządzania posiłkami
export const mealService = {
  getMeals: (token, queryParams = null) => makeRequest('/meals', 'GET', null, token, queryParams),
  createMeal: (mealData, token) => makeRequest('/meals', 'POST', mealData, token),
  updateMeal: (id, mealData, token) => makeRequest(`/meals/${id}`, 'PUT', mealData, token),
  deleteMeal: (id, token) => makeRequest(`/meals/${id}`, 'DELETE', null, token),
};

// Funkcje do zarządzania treningami
export const trainingService = {
  getTrainings: (token, queryParams = null) => makeRequest('/trainings', 'GET', null, token, queryParams),
  createTraining: (trainingData, token) => makeRequest('/trainings', 'POST', trainingData, token),
  updateTraining: (id, trainingData, token) => makeRequest(`/trainings/${id}`, 'PUT', trainingData, token),
  deleteTraining: (id, token) => makeRequest(`/trainings/${id}`, 'DELETE', null, token),
};

// Funkcje do zarządzania finansami
export const financeService = {
  getFinanceRecords: (token, queryParams = null) => makeRequest('/finance', 'GET', null, token, queryParams),
  createFinanceRecord: (recordData, token) => makeRequest('/finance', 'POST', recordData, token),
  updateFinanceRecord: (id, recordData, token) => makeRequest(`/finance/${id}`, 'PUT', recordData, token),
  deleteFinanceRecord: (id, token) => makeRequest(`/finance/${id}`, 'DELETE', null, token),
};