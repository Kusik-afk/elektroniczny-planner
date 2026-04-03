// src/components/Tasks.jsx
import React, { useState, useEffect } from 'react';

// Klasa Task (możesz ją umieścić w osobnym pliku utils/models.js, ale na razie tutaj)
class Task {
  constructor(name, priority, completed = false, id = Date.now()) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.completed = completed;
  }
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState('niski');

  // Ładowanie zadań z LocalStorage przy pierwszym renderowaniu
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []); // Pusta tablica zależności oznacza, że efekt uruchomi się tylko raz

  // Zapisywanie zadań do LocalStorage za każdym razem, gdy tasks się zmieni
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Efekt uruchomi się, gdy 'tasks' się zmieni

  const handleAddTask = (event) => {
    event.preventDefault();
    if (taskName.trim() === '') {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    const newTask = new Task(taskName, taskPriority);
    setTasks([...tasks, newTask]); // Dodajemy nowe zadanie do istniejących
    setTaskName(''); // Czyścimy pole
  };

  const handleToggleTaskCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <section id="zadania" className="card collapsible-section">
      <h2 className="collapsible-header">Twoje Zadania <span className="toggle-icon">-</span></h2> {/* Domyślnie rozwinięte */}
      <div className="collapsible-content">
        <h3>Dodaj nowe zadanie</h3>
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <label htmlFor="taskName">Nazwa zadania:</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskPriority">Priorytet:</label>
            <select
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="niski">Niski</option>
              <option value="sredni">Średni</option>
              <option value="wysoki">Wysoki</option>
            </select>
          </div>
          <button type="submit" className="button">Dodaj zadanie</button>
        </form>

        <h3>Lista zadań:</h3>
        <ul id="taskList">
          {tasks.length === 0 ? (
            <p>Brak zadań do wykonania.</p>
          ) : (
            tasks.map(task => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTaskCompleted(task.id)}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#333' }}>
                  {task.name} (Priorytet: {task.priority})
                </span>
                <button className="button-remove-item" onClick={() => handleDeleteTask(task.id)}>Usuń</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export default Tasks;