// src/components/Meals.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { mealService } from '../services/apiService';

function Meals() {
  const [mealPlan, setMealPlan] = useState([]);
  const [mealDay, setMealDay] = useState('Poniedziałek');
  const [mealType, setMealType] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealIngredients, setMealIngredients] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filterDay, setFilterDay] = useState('Wszystkie');
  const [sortOrder, setSortOrder] = useState('dayOfWeek_asc');
  const { token } = useAuth();

  const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

  const fetchMeals = useCallback(async () => {
    if (!token) return;
    try {
      const queryParams = {};
      if (filterDay !== 'Wszystkie') {
        queryParams.dayOfWeek = filterDay;
      }

      let sortBy = 'dayOfWeek';
      let sortDir = 'asc';
      if (sortOrder.includes('_')) {
        [sortBy, sortDir] = sortOrder.split('_');
      }
      queryParams.sortBy = sortBy;
      queryParams.sortDir = sortDir;

      const response = await mealService.getMeals(token, queryParams);
      setMealPlan(response.meals || []);
    } catch (error) {
      console.error('Błąd podczas pobierania posiłków:', error);
    }
  }, [token, filterDay, sortOrder]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleAddMeal = async (event) => {
    event.preventDefault();
    if (mealType.trim() === '' || mealName.trim() === '' || mealCalories.trim() === '') {
      alert('Proszę wypełnić wszystkie wymagane pola posiłku!');
      return;
    }
    try {
      const newMealData = {
        dayOfWeek: mealDay,
        mealType: mealType,
        name: mealName,
        calories: parseInt(mealCalories),
        ingredients: mealIngredients.split(',').map(item => item.trim()).filter(item => item !== '')
      };
      await mealService.createMeal(newMealData, token);
      fetchMeals();
      setMealType('');
      setMealName('');
      setMealCalories('');
      setMealIngredients('');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas dodawania posiłku:', error);
      alert(error.message || 'Nie udało się dodać posiłku.');
    }
  };

  const handleDeleteMeal = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten posiłek?')) return;
    try {
      await mealService.deleteMeal(id, token);
      fetchMeals();
    } catch (error) {
      console.error('Błąd podczas usuwania posiłku:', error);
      alert(error.message || 'Nie udało się usunąć posiłku.');
    }
  };

  return (
    <Card title="Plan Posiłków" isCollapsible defaultCollapsed={false}>
      <h3>Tygodniowy plan posiłków:</h3>

      <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <label htmlFor="filterDay">Filtruj wg dnia:</label>
        <select id="filterDay" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
          <option value="Wszystkie">Wszystkie</option>
          {daysOrder.map(day => <option key={day} value={day}>{day}</option>)}
        </select>

        <label htmlFor="sortOrder">Sortuj wg:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="dayOfWeek_asc">Dnia i Pory (rosnąco)</option>
          <option value="calories_asc">Kalorii (rosnąco)</option>
          <option value="calories_desc">Kalorii (malejąco)</option>
          <option value="mealType_asc">Pory posiłku (rosnąco)</option>
          <option value="name_asc">Nazwy posiłku (rosnąco)</option>
        </select>
      </div>

      <table id="mealPlanTable">
        <thead>
          <tr>
            <th>Dzień</th>
            <th>Pora dnia</th>
            <th>Posiłek</th>
            <th>Kalorie</th>
            <th>Składniki</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {mealPlan.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Brak posiłków w planie.</td>
            </tr>
          ) : (
            mealPlan.map(meal => (
              <tr key={meal._id}>
                <td>{meal.dayOfWeek}</td>
                <td>{meal.mealType}</td>
                <td>{meal.name}</td>
                <td>{meal.calories} kcal</td>
                <td>{meal.ingredients && meal.ingredients.join(', ')}</td>
                <td>
                  <button className="button-remove-item button-small" onClick={() => handleDeleteMeal(meal._id)}>Usuń</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="button" onClick={() => setIsAddModalOpen(true)}>Dodaj posiłek</button>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Dodaj posiłek do planu">
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
            <label htmlFor="mealType">Pora dnia:</label>
            <input
              type="text"
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
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
          <div className="form-group">
            <label htmlFor="mealIngredients">Składniki (rozdzielone przecinkami):</label>
            <input
              type="text"
              id="mealIngredients"
              value={mealIngredients}
              onChange={(e) => setMealIngredients(e.target.value)}
              placeholder="np. płatki owsiane, mleko, owoce"
            />
          </div>
          <button type="submit" className="button">Dodaj posiłek</button>
        </form>
      </Modal>
    </Card>
  );
}

export default Meals;