// src/components/SummaryCards.jsx
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from './Card';
import { Meal, Workout, Task } from '../utils/models'; // Import klas do typowania

function SummaryCards() {
  const [mealPlan] = useLocalStorage('mealPlan', []);
  const [workouts] = useLocalStorage('workouts', []);
  const [tasks] = useLocalStorage('tasks', []);

  // Obliczanie sumy kalorii
  const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.calories, 0);

  // Obliczanie sumy czasu treningów
  const totalTrainingTime = workouts.reduce((sum, workout) => sum + workout.duration, 0);

  // Obliczanie liczby niewykonanych zadań
  const pendingTasks = tasks.filter(task => !task.completed).length;

  // Symulacja wydatków (na razie statyczna, bo nie mamy modułu finansów)
  const totalExpenses = 750.00; // Przykładowa wartość

  return (
    <> {/* Fragment, żeby zwrócić wiele elementów bez dodatkowego diva */}
      <Card title="Podsumowanie Kalorii (wszystkie posiłki)" className="summary-card">
        <p>Łącznie: <strong>{totalCalories} kcal</strong></p>
      </Card>

      <Card title="Łączny Czas Treningów" className="summary-card">
        <p>Łącznie: <strong>{totalTrainingTime} min</strong></p>
      </Card>

      <Card title="Zadania do Wykonania" className="summary-card">
        <p>Pozostało: <strong>{pendingTasks}</strong></p>
      </Card>

      <Card title="Wydatki (ostatni miesiąc)" className="summary-card">
        <p>Łącznie: <strong>{totalExpenses.toFixed(2)} PLN</strong></p>
      </Card>
    </>
  );
}

export default SummaryCards;