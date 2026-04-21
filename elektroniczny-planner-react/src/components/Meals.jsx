// src/components/Meals.jsx
import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Meal } from '../utils/models';
import Card from './Card';
import Modal from './Modal';

function Meals() {
  const [mealPlan, setMealPlan] = useLocalStorage('mealPlan', []);
  const [mealDay, setMealDay] = useState('Poniedziałek');
  const [mealTime, setMealTime] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrowanie i sortowanie posiłków
  const [filterDay, setFilterDay] = useState('Wszystkie');
  const [sortOrder, setSortOrder] = useState('day'); // 'day', 'calories-asc', 'calories-desc'

  const handleAddMeal = (event) => {
    event.preventDefault();
    if (mealTime.trim() === '' || mealName.trim() === '' || mealCalories.trim() === '') {
      alert('Proszę wypełnić wszystkie pola posiłku!');
      return;
    }
    const newMeal = new Meal(mealDay, mealTime, mealName, parseInt(mealCalories));
    setMealPlan([...mealPlan, newMeal]);
    setMealTime('');
    setMealName('');
    setMealCalories('');
    setIsModalOpen(false);
  };

  const handleDeleteMeal = (id) => {
    setMealPlan(mealPlan.filter(meal => meal.id !== id));
  };

  // Logika filtrowania
  const filteredMeals = mealPlan.filter(meal => {
    if (filterDay === 'Wszystkie') return true;
    return meal.day === filterDay;
  });

  // Logika sortowania
  const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (sortOrder === 'day') {
      const dayA = daysOrder.indexOf(a.day);
      const dayB = daysOrder.indexOf(b.day);
      if (dayA !== dayB) return dayA - dayB;
      return a.time.localeCompare(b.time);
    } else if (sortOrder === 'calories-asc') {
      return a.calories - b.calories;
    } else if (sortOrder === 'calories-desc') {
      return b.calories - a.calories;
    }
    return 0;
  });

  return (
    <Card title="Plan Posiłków" isCollapsible defaultCollapsed={false}>
      <h3>Tygodniowy plan posiłków:</h3>

      <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <label>Filtruj wg dnia:</label>
        <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
          <option value="Wszystkie">Wszystkie</option>
          {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
        </select>

        <label>Sortuj wg:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="day">Dnia i Pory</option>
          <option value="calories-asc">Kalorii (rosnąco)</option>
          <option value="calories-desc">Kalorii (malejąco)</option>
        </select>
      </div>

      <table id="mealPlanTable">
        <thead>
          <tr>
            <th>Dzień</th>
            <th>Pora dnia</th>
            <th>Posiłek</th>
            <th>Kalorie</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sortedMeals.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Brak posiłków w planie.</td>
            </tr>
          ) : (
            sortedMeals.map(meal => (
              <tr key={meal.id}>
                <td>{meal.day}</td>
                <td>{meal.time}</td>
                <td>{meal.name}</td>
                <td>{meal.calories} kcal</td>
                <td>
                  <button className="button-remove-item" onClick={() => handleDeleteMeal(meal.id)}>Usuń</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="button" onClick={() => setIsModalOpen(true)}>Dodaj posiłek</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj posiłek do planu">
        <form onSubmit={handleAddMeal}>
          <div className="form-group">
            <label htmlFor="mealDay">Dzień tygodnia:</label>
            <select
              id="mealDay"
              value={mealDay}
              onChange={(e) => setMealDay(e.target.value)}
              required
            >
              {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mealTime">Pora dnia:</label>
            <input
              type="text"
              id="mealTime"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              required
              placeholder="np. Śniadanie, Obiad"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealName">Nazwa posiłku:</label>
            <input
              type="text"
              id="mealName"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              required
              placeholder="np. Owsianka z owocami"
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealCalories">Kalorie:</label>
            <input
              type="number"
              id="mealCalories"
              value={mealCalories}
              onChange={(e) => setMealCalories(e.target.value)}
              min="0"
              required
            />
          </div>
          <button type="submit" className="button">Dodaj posiłek</button>
        </form>
      </Modal>
    </Card>
  );
}

export default Meals;