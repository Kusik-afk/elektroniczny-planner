// src/components/Training.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { trainingService } from '../services/apiService';

function Training() {
  const [workouts, setWorkouts] = useState([]);
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Nowe stany do filtrowania i sortowania treningów
  const [filterType, setFilterType] = useState('Wszystkie'); // 'Wszystkie', lub konkretny typ
  const [sortOrder, setSortOrder] = useState('date_desc'); // 'date_desc', 'date_asc', 'duration_desc', 'duration_asc'

  const { token } = useAuth();

  // Liczniki pozostają w LocalStorage, bo nie są częścią API treningów
  const [runningCount, setRunningCount] = useState(() => parseInt(localStorage.getItem('runningCount')) || 0);
  const [gymCount, setGymCount] = useState(() => parseInt(localStorage.getItem('gymCount')) || 0);

  // Efekty dla liczników
  useEffect(() => {
    localStorage.setItem('runningCount', runningCount.toString());
  }, [runningCount]);

  useEffect(() => {
    localStorage.setItem('gymCount', gymCount.toString());
  }, [gymCount]);

  const fetchWorkouts = useCallback(async () => {
    if (!token) return;
    try {
      const queryParams = {};
      if (filterType !== 'Wszystkie') {
        queryParams.type = filterType;
      }

      let sortBy = 'date';
      let sortDir = 'desc';
      if (sortOrder.includes('_')) {
        [sortBy, sortDir] = sortOrder.split('_');
      }
      queryParams.sortBy = sortBy;
      queryParams.sortDir = sortDir;

      const response = await trainingService.getTrainings(token, queryParams);
      setWorkouts(response.trainings || []); // Backend zwraca obiekt z trainings i metadanymi
    } catch (error) {
      console.error('Błąd podczas pobierania treningów:', error);
    }
  }, [token, filterType, sortOrder]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleAddWorkout = async (event) => {
    event.preventDefault();
    if (workoutType.trim() === '' || workoutDuration.trim() === '' || workoutDate.trim() === '') {
      alert('Proszę wypełnić wszystkie wymagane pola treningu!');
      return;
    }
    try {
      const newWorkoutData = { type: workoutType, duration: parseInt(workoutDuration), date: workoutDate };
      await trainingService.createTraining(newWorkoutData, token);
      fetchWorkouts();
      setWorkoutType('');
      setWorkoutDuration('');
      setWorkoutDate('');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas dodawania treningu:', error);
      alert(error.message || 'Nie udało się dodać treningu.');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten trening?')) return;
    try {
      await trainingService.deleteTraining(id, token);
      fetchWorkouts();
    } catch (error) {
      console.error('Błąd podczas usuwania treningu:', error);
      alert(error.message || 'Nie udało się usunąć treningu.');
    }
  };

  const handleIncrement = (type) => {
    if (type === 'running') {
      setRunningCount(prev => prev + 1);
    } else if (type === 'gym') {
      setGymCount(prev => prev + 1);
    }
  };

  // Zbierz unikalne typy treningów do filtra
  const uniqueWorkoutTypes = ['Wszystkie', ...new Set(workouts.map(w => w.type))];

  return (
    <Card title="Twoje Treningi" isCollapsible defaultCollapsed={false}>
      <h3>Historia treningów:</h3>

      <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <label htmlFor="filterType">Filtruj wg typu:</label>
        <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          {uniqueWorkoutTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <label htmlFor="sortOrder">Sortuj wg:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="date_desc">Najnowsze</option>
          <option value="date_asc">Najstarsze</option>
          <option value="duration_desc">Czas trwania (dłuższe)</option>
          <option value="duration_asc">Czas trwania (krótsze)</option>
        </select>
      </div>

      <div id="workoutHistory">
        {workouts.length === 0 ? (
          <p>Brak zapisanych treningów.</p>
        ) : (
          workouts.map(workout => (
            <article key={workout._id} className="workout-entry">
              <div>
                <h3>{workout.type}</h3>
                <p>Czas: {workout.duration} min, Data: {new Date(workout.date).toLocaleDateString()}</p>
              </div>
              <button className="button-remove-item" onClick={() => handleDeleteWorkout(workout._id)}>Usuń</button>
            </article>
          ))
        )}
      </div>
      <button className="button" onClick={() => setIsAddModalOpen(true)}>Dodaj nowy trening</button>

      <h3>Szybkie liczniki:</h3>
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
        <Card className="flex-item" title="Bieganie">
          <p>Ilość biegów: <span id="runningCount">{runningCount}</span></p>
          <button className="button" onClick={() => handleIncrement('running')}>Dodaj bieg</button>
        </Card>
        <Card className="flex-item" title="Siłownia">
          <p>Ilość treningów: <span id="gymCount">{gymCount}</span></p>
          <button className="button" onClick={() => handleIncrement('gym')}>Dodaj trening</button>
        </Card>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Dodaj nowy trening">
        <form onSubmit={handleAddWorkout}>
          <div className="form-group">
            <label htmlFor="workoutType">Rodzaj treningu:</label>
            <input
              type="text"
              id="workoutType"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
              required
              placeholder="np. Bieganie, Siłownia"
            />
          </div>
          <div className="form-group">
            <label htmlFor="workoutDuration">Czas (minuty):</label>
            <input
              type="number"
              id="workoutDuration"
              value={workoutDuration}
              onChange={(e) => setWorkoutDuration(e.target.value)}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="workoutDate">Data:</label>
            <input
              type="date"
              id="workoutDate"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">Zapisz trening</button>
        </form>
      </Modal>
    </Card>
  );
}

export default Training;