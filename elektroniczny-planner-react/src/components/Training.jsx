// src/components/Training.jsx
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Workout } from '../utils/models';
import Card from './Card';
import Modal from './Modal';

function Training() {
  const [workouts, setWorkouts] = useLocalStorage('workouts', []);
  const [workoutType, setWorkoutType] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [runningCount, setRunningCount] = useLocalStorage('runningCount', 0);
  const [gymCount, setGymCount] = useLocalStorage('gymCount', 0);

  const handleAddWorkout = (event) => {
    event.preventDefault();
    if (workoutType.trim() === '' || workoutDuration.trim() === '' || workoutDate.trim() === '') {
      alert('Proszę wypełnić wszystkie pola treningu!');
      return;
    }
    const newWorkout = new Workout(workoutType, parseInt(workoutDuration), workoutDate);
    setWorkouts([...workouts, newWorkout]);
    setWorkoutType('');
    setWorkoutDuration('');
    setWorkoutDate('');
    setIsModalOpen(false);
  };

  const handleDeleteWorkout = (id) => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  const handleIncrement = (type) => {
    if (type === 'running') {
      setRunningCount(prev => prev + 1);
    } else if (type === 'gym') {
      setGymCount(prev => prev + 1);
    }
  };

  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Card title="Twoje Treningi" isCollapsible defaultCollapsed={false}>
      <h3>Historia treningów:</h3>
      <div id="workoutHistory">
        {sortedWorkouts.length === 0 ? (
          <p>Brak zapisanych treningów.</p>
        ) : (
          sortedWorkouts.map(workout => (
            <article key={workout.id} className="workout-entry">
              <div>
                <h3>{workout.type}</h3>
                <p>Czas: {workout.duration} min, Data: {workout.date}</p>
              </div>
              <button className="button-remove-item" onClick={() => handleDeleteWorkout(workout.id)}>Usuń</button>
            </article>
          ))
        )}
      </div>
      <button className="button" onClick={() => setIsModalOpen(true)}>Dodaj nowy trening</button>

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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj nowy trening">
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