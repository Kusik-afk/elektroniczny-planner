// src/pages/WeeklyMealPlanPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { mealService } from '../services/apiService';
import PageLayout from '../components/PageLayout'; // Importujemy nowy PageLayout

function WeeklyMealPlanPage() {
  const [mealPlan, setMealPlan] = useState([]);
  const { token } = useAuth();

  const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

  const fetchMeals = useCallback(async () => {
    if (!token) return;
    try {
      const response = await mealService.getMeals(token, { limit: 1000 });
      setMealPlan(response.meals || []);
    } catch (error) {
      console.error('Błąd podczas pobierania posiłków:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

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
    <PageLayout title="Tygodniowy Plan Posiłków"> {/* Używamy PageLayout */}
      {mealPlan.length === 0 && !token ? (
        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Ładowanie planu posiłków...</p>
      ) : mealPlan.length === 0 && token ? (
        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Brak posiłków w planie. Dodaj je w sekcji "Posiłki" na Dashboardzie.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)', width: '100%' }}> {/* Dodajemy grid dla kart dni */}
          {daysOrder.map(day => (
            <Card key={day} title={day} isCollapsible defaultCollapsed={false}>
              {mealPlan.filter(meal => meal.dayOfWeek === day).length === 0 ? (
                <p>Brak posiłków zaplanowanych na {day}.</p>
              ) : (
                <ul>
                  {mealPlan
                    .filter(meal => meal.dayOfWeek === day)
                    .sort((a, b) => a.mealType.localeCompare(b.mealType))
                    .map(meal => (
                      <li key={meal._id} className="meal-plan-item">
                        <span>{meal.mealType}: {meal.name} ({meal.calories} kcal)</span>
                        <button className="button-remove-item button-small" onClick={() => handleDeleteMeal(meal._id)}>Usuń</button>
                      </li>
                    ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default WeeklyMealPlanPage;