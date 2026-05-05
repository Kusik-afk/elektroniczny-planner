// src/components/Tasks.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/apiService';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskPriority, setTaskPriority] = useState('niski');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal do dodawania
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal do edycji
  const [editingTask, setEditingTask] = useState(null); // Zadanie, które edytujemy

  // Nowe stany do filtrowania i sortowania zadań
  const [filterCompleted, setFilterCompleted] = useState('all'); // 'all', 'true', 'false'
  const [sortOrder, setSortOrder] = useState('createdAt_desc'); // 'createdAt_desc', 'createdAt_asc', 'priority_desc', 'priority_asc'

  const { token } = useAuth();

  // Funkcja do pobierania zadań z API z filtrowaniem i sortowaniem
  const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const queryParams = {};
      if (filterCompleted !== 'all') {
        queryParams.completed = filterCompleted;
      }

      let sortBy = 'createdAt';
      let sortDir = 'desc';
      if (sortOrder.includes('_')) {
        [sortBy, sortDir] = sortOrder.split('_');
      }
      queryParams.sortBy = sortBy;
      queryParams.sortDir = sortDir;

      const response = await taskService.getTasks(token, queryParams);
      setTasks(response.tasks || []); // Backend zwraca obiekt z tasks i metadanymi
    } catch (error) {
      console.error('Błąd podczas pobierania zadań:', error);
    }
  }, [token, filterCompleted, sortOrder]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (taskName.trim() === '') {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    try {
      const newTaskData = { name: taskName, priority: taskPriority };
      await taskService.createTask(newTaskData, token);
      fetchTasks(); // Odśwież listę zadań
      setTaskName('');
      setTaskPriority('niski');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas dodawania zadania:', error);
      alert(error.message || 'Nie udało się dodać zadania.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setTaskName(task.name); // Ustawiamy pola formularza na wartości edytowanego zadania
    setTaskPriority(task.priority);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (event) => {
    event.preventDefault();
    if (!editingTask || taskName.trim() === '') {
      alert('Nazwa zadania nie może być pusta!');
      return;
    }
    try {
      const updatedTaskData = { name: taskName, priority: taskPriority };
      await taskService.updateTask(editingTask._id, updatedTaskData, token);
      fetchTasks(); // Odśwież listę zadań
      setEditingTask(null);
      setTaskName('');
      setTaskPriority('niski');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas aktualizacji zadania:', error);
      alert(error.message || 'Nie udało się zaktualizować zadania.');
    }
  };


  // Archwizacja to po prostu zmiana statusu completed
  const handleToggleTaskCompleted = async (id, currentStatus) => {
    try {
      await taskService.updateTask(id, { completed: !currentStatus }, token);
      fetchTasks(); // Odśwież listę zadań
    } catch (error) {
      console.error('Błąd podczas aktualizacji zadania:', error);
      alert(error.message || 'Nie udało się zaktualizować zadania.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zadanie?')) return;
    try {
      await taskService.deleteTask(id, token);
      fetchTasks(); // Odśwież listę zadań
    } catch (error) {
      console.error('Błąd podczas usuwania zadania:', error);
      alert(error.message || 'Nie udało się usunąć zadania.');
    }
  };

  return (
    <Card title="Twoje Zadania" isCollapsible defaultCollapsed={false}>
      <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <label htmlFor="filterCompleted">Pokaż:</label>
        <select id="filterCompleted" value={filterCompleted} onChange={(e) => setFilterCompleted(e.target.value)}>
          <option value="all">Wszystkie</option>
          <option value="false">Do zrobienia</option>
          <option value="true">Wykonane</option>
        </select>

        <label htmlFor="sortOrder">Sortuj wg:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="createdAt_desc">Najnowsze</option>
          <option value="createdAt_asc">Najstarsze</option>
          <option value="priority_desc">Priorytet (wysoki-niski)</option>
          <option value="priority_asc">Priorytet (niski-wysoki)</option>
          <option value="name_asc">Nazwa (A-Z)</option>
        </select>
      </div>

      <h3>Lista zadań:</h3>
      <ul id="taskList">
        {tasks.length === 0 ? (
          <p>Brak zadań do wykonania.</p>
        ) : (
          tasks.map(task => (
            <li key={task._id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTaskCompleted(task._id, task.completed)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#333' }}>
                {task.name} (Priorytet: {task.priority})
              </span>
              <div className="task-actions">
                <button className="button button-secondary button-small" onClick={() => handleEditClick(task)}>Edytuj</button>
                <button className="button-remove-item button-small" onClick={() => handleDeleteTask(task._id)}>Usuń</button>
              </div>
            </li>
          ))
        )}
      </ul>
      <button className="button" onClick={() => setIsAddModalOpen(true)}>Dodaj nowe zadanie</button>

      {/* Modal do dodawania zadania */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Dodaj nowe zadanie">
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <label htmlFor="taskNameAdd">Nazwa zadania:</label>
            <input
              type="text"
              id="taskNameAdd"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskPriorityAdd">Priorytet:</label>
            <select
              id="taskPriorityAdd"
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

      {/* Modal do edycji zadania */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edytuj zadanie">
        {editingTask && (
          <form onSubmit={handleUpdateTask}>
            <div className="form-group">
              <label htmlFor="taskNameEdit">Nazwa zadania:</label>
              <input
                type="text"
                id="taskNameEdit"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="taskPriorityEdit">Priorytet:</label>
              <select
                id="taskPriorityEdit"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
              >
                <option value="niski">Niski</option>
                <option value="sredni">Średni</option>
                <option value="wysoki">Wysoki</option>
              </select>
            </div>
            <button type="submit" className="button">Zapisz zmiany</button>
          </form>
        )}
      </Modal>
    </Card>
  );
}

export default Tasks;