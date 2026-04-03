// src/components/Meals.jsx
import React, { useState, useEffect } from 'react';

// Klasa Meal
class Meal {
  constructor(day, time, name, calories, id = Date.now()) {
    this.id = id;
    this.day = day;
    this.time = time;
    this.name = name;
    this.calories = calories;
  }
}

function Meals() {
  const [mealPlan, setMealPlan] = useState([]);
  const [mealDay, setMealDay] = useState('Poniedziałek');
  const [mealTime, setMealTime] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');

  useEffect(() => {
    const storedMealPlan = JSON.parse(localStorage.getItem('mealPlan')) || [];
    setMealPlan(storedMealPlan);
  }, []);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

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
  };

  const handleDeleteMeal = (id) => {
    setMealPlan(mealPlan.filter(meal => meal.id !== id));
  };

  // Sortowanie posiłków według dnia tygodnia i pory dnia
  const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
  const sortedMealPlan = [...mealPlan].sort((a, b) => {
    const dayA = daysOrder.indexOf(a.day);
    const dayB = daysOrder.indexOf(b.day);
    if (dayA !== dayB) return dayA - dayB;
    return a.time.localeCompare(b.time);
  });

  return (
    <section id="posilki" className="card collapsible-section">
      <h2 className="collapsible-header">Plan Posiłków <span className="toggle-icon">-</span></h2>
      <div className="collapsible-content">
        <h3>Dodaj posiłek do planu</h3>
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

        <h3>Tygodniowy plan posiłków:</h3>
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
            {sortedMealPlan.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Brak posiłków w planie.</td>
              </tr>
            ) : (
              sortedMealPlan.map(meal => (
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
      </div>
    </section>
  );
}

export default Meals;