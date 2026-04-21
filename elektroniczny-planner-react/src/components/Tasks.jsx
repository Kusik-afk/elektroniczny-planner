// src/components/Tasks.jsx
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Task } from '../utils/models';
import Card from './Card'; // Importujemy nowy komponent Card
import Modal from './Modal'; // Importujemy nowy komponent Modal

function Tasks() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState('niski');
  const [isModalOpen, setIsModalOpen] = useState(false); // Stan do kontroli modala

  const handleAddTask = (event) => {
    event.preventDefault();
    if (taskName.trim() === '') {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    const newTask = new Task(taskName, taskPriority);
    setTasks([...tasks, newTask]);
    setTaskName('');
    setIsModalOpen(false); // Zamknij modal po dodaniu zadania
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
    <Card title="Twoje Zadania" isCollapsible defaultCollapsed={false}> {/* Używamy komponentu Card */}
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
      <button className="button" onClick={() => setIsModalOpen(true)}>Dodaj nowe zadanie</button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Dodaj nowe zadanie">
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
      </Modal>
    </Card>
  );
}

export default Tasks;