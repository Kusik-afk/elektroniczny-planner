// src/pages/WeeklyMealPlanPage.jsx
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/Card';
import { Meal } from '../utils/models';

function WeeklyMealPlanPage() {
  const [mealPlan, setMealPlan] = useLocalStorage('mealPlan', []);
  const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

  const handleDeleteMeal = (id) => {
    setMealPlan(mealPlan.filter(meal => meal.id !== id));
  };

  return (
    <div className="dashboard-layout"> {/* Używamy layoutu dashboardu, ale bez SideMenu */}
      <main className="main-content">
        <h1 style={{ gridColumn: '1 / -1', marginBottom: 'var(--spacing-lg)' }}>Tygodniowy Plan Posiłków</h1>

        {daysOrder.map(day => (
          <Card key={day} title={day} isCollapsible defaultCollapsed={false}>
            {mealPlan.filter(meal => meal.day === day).length === 0 ? (
              <p>Brak posiłków zaplanowanych na {day}.</p>
            ) : (
              <ul>
                {mealPlan
                  .filter(meal => meal.day === day)
                  .sort((a, b) => a.time.localeCompare(b.time)) // Sortuj posiłki w danym dniu wg pory
                  .map(meal => (
                    <li key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-xs) 0', borderBottom: '1px solid var(--border-color)' }}>
                      <span>{meal.time}: {meal.name} ({meal.calories} kcal)</span>
                      <button className="button-remove-item" onClick={() => handleDeleteMeal(meal.id)}>Usuń</button>
                    </li>
                  ))}
              </ul>
            )}
          </Card>
        ))}
      </main>
    </div>
  );
}

export default WeeklyMealPlanPage;