// src/components/SummaryCards.jsx
import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from './Card';
import { useAuth } from '../context/AuthContext';
import { mealService, trainingService, taskService, financeService } from '../services/apiService';

function SummaryCards() {
  const { token } = useAuth();
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [financeRecords, setFinanceRecords] = useState([]);

  const [runningCount] = useLocalStorage('runningCount', 0);
  const [gymCount] = useLocalStorage('gymCount', 0);

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    try {
      const [mealsData, workoutsData, tasksData, financeData] = await Promise.all([
        mealService.getMeals(token),
        trainingService.getTrainings(token),
        taskService.getTasks(token),
        financeService.getFinanceRecords(token),
      ]);
        const safeArray = (data, key) =>
        Array.isArray(data)
          ? data
          : Array.isArray(data?.[key])
          ? data[key]
          : [];

      setMeals(safeArray(mealsData, 'meals'));
      setWorkouts(safeArray(workoutsData, 'trainings'));
      setTasks(safeArray(tasksData, 'tasks'));
      setFinanceRecords(safeArray(financeData, 'records'));
    } catch (error) {
      console.error('Błąd podczas pobierania danych podsumowania:', error);
      // Możesz dodać obsługę błędu, np. wyświetlić komunikat użytkownikowi
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalTrainingTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const totalExpenses = Array.isArray(financeRecords)
  ? financeRecords
      .filter(record => record.type === 'Wydatek')
      .reduce((sum, record) => sum + (record.amount || 0), 0)
  : 0;

  return (
    <>
      <Card title="Podsumowanie Kalorii" className="summary-card">
        <p>Łącznie: <strong>{totalCalories} kcal</strong></p>
      </Card>

      <Card title="Łączny Czas Treningów" className="summary-card">
        <p>Łącznie: <strong>{totalTrainingTime} min</strong></p>
      </Card>

      <Card title="Zadania do Wykonania" className="summary-card">
        <p>Pozostało: <strong>{pendingTasks}</strong></p>
      </Card>

      <Card title="Wydatki (całość)" className="summary-card">
        <p>Łącznie: <strong>{totalExpenses.toFixed(2)} PLN</strong></p>
      </Card>

      <Card title="Biegi (lokalnie)" className="summary-card">
        <p>Ilość biegów: <strong>{runningCount}</strong></p>
      </Card>
      <Card title="Siłownia (lokalnie)" className="summary-card">
        <p>Ilość treningów: <strong>{gymCount}</strong></p>
      </Card>
    </>
  );
}

export default SummaryCards;