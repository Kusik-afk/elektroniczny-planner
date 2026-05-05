// src/components/Finance.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { financeService } from '../services/apiService';

function Finance() {
  const [financeRecords, setFinanceRecords] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [type, setType] = useState('Wydatek');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  // Nowe stany do filtrowania miesięcznego
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Miesiące są od 0-11
  const [filterMonth, setFilterMonth] = useState(currentMonth.toString());
  const [filterYear, setFilterYear] = useState(currentYear.toString());
  const [sortOrder, setSortOrder] = useState('date_desc'); // 'date_desc', 'date_asc', 'amount_desc', 'amount_asc'

  const { token } = useAuth();

  const fetchFinanceRecords = useCallback(async () => {
    if (!token) return;
    try {
      const queryParams = {};
      if (filterMonth !== 'all') {
        queryParams.month = filterMonth;
      }
      if (filterYear !== 'all') {
        queryParams.year = filterYear;
      }

      let sortBy = 'date';
      let sortDir = 'desc';
      if (sortOrder.includes('_')) {
        [sortBy, sortDir] = sortOrder.split('_');
      }
      queryParams.sortBy = sortBy;
      queryParams.sortDir = sortDir;

      const response = await financeService.getFinanceRecords(token, queryParams);
      setFinanceRecords(response.financeRecords || []); // Backend zwraca obiekt z financeRecords i metadanymi
    } catch (error) {
      console.error('Błąd podczas pobierania wpisów finansowych:', error);
    }
  }, [token, filterMonth, filterYear, sortOrder]);

  useEffect(() => {
    fetchFinanceRecords();
  }, [fetchFinanceRecords]);

  const handleAddFinanceRecord = async (event) => {
    event.preventDefault();
    if (!type || !amount || !description || !date) {
      alert('Proszę wypełnić wszystkie wymagane pola!');
      return;
    }
    try {
      const newRecordData = { type, amount: parseFloat(amount), description, category, date };
      await financeService.createFinanceRecord(newRecordData, token);
      fetchFinanceRecords();
      setType('Wydatek');
      setAmount('');
      setDescription('');
      setCategory('');
      setDate('');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas dodawania wpisu finansowego:', error);
      alert(error.message || 'Nie udało się dodać wpisu finansowego.');
    }
  };

  const handleDeleteFinanceRecord = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten wpis finansowy?')) return;
    try {
      await financeService.deleteFinanceRecord(id, token);
      fetchFinanceRecords();
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu finansowego:', error);
      alert(error.message || 'Nie udało się usunąć wpisu finansowego.');
    }
  };

  // Obliczenia podsumowań dla bieżącego widoku
  const totalIncome = financeRecords
    .filter(record => record.type === 'Dochód')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = financeRecords
    .filter(record => record.type === 'Wydatek')
    .reduce((sum, record) => sum + record.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Generowanie opcji lat (np. bieżący rok i 2 lata wstecz)
  const years = Array.from({ length: 3 }, (_, i) => (currentYear - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')); // 01, 02, ...

  return (
    <Card title="Podsumowanie Finansów" isCollapsible defaultCollapsed={false}>
      <h3>Przegląd miesięcznych wydatków:</h3>

      <div style={{ marginBottom: 'var(--spacing-md)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <label htmlFor="filterMonth">Miesiąc:</label>
        <select id="filterMonth" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="all">Wszystkie</option>
          {months.map(month => <option key={month} value={month}>{month}</option>)}
        </select>

        <label htmlFor="filterYear">Rok:</label>
        <select id="filterYear" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">Wszystkie</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>

        <label htmlFor="sortOrder">Sortuj wg:</label>
        <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="date_desc">Najnowsze</option>
          <option value="date_asc">Najstarsze</option>
          <option value="amount_desc">Kwota (malejąco)</option>
          <option value="amount_asc">Kwota (rosnąco)</option>
        </select>
      </div>

      <div style={{ marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-md)', border: '1px solid var(--border-color)', borderRadius: 'var(--spacing-xs)' }}>
        <p>Dochody w tym okresie: <strong style={{ color: 'green' }}>{totalIncome.toFixed(2)} PLN</strong></p>
        <p>Wydatki w tym okresie: <strong style={{ color: 'red' }}>{totalExpenses.toFixed(2)} PLN</strong></p>
        <p>Bilans: <strong style={{ color: balance >= 0 ? 'green' : 'red' }}>{balance.toFixed(2)} PLN</strong></p>
      </div>

      <h3>Wpisy finansowe:</h3>
      <ul>
        {financeRecords.length === 0 ? (
          <p>Brak wpisów finansowych w wybranym okresie.</p>
        ) : (
          financeRecords.map(record => (
            <li key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-xs) 0', borderBottom: '1px solid var(--border-color)' }}>
              <span>{new Date(record.date).toLocaleDateString()} - {record.description} ({record.type}): <strong style={{ color: record.type === 'Dochód' ? 'green' : 'red' }}>{record.amount.toFixed(2)} PLN</strong></span>
              <button className="button-remove-item" onClick={() => handleDeleteFinanceRecord(record._id)}>Usuń</button>
            </li>
          ))
        )}
      </ul>
      <button className="button" onClick={() => setIsAddModalOpen(true)}>Dodaj wpis finansowy</button>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Dodaj wpis finansowy">
        <form onSubmit={handleAddFinanceRecord}>
          <div className="form-group">
            <label htmlFor="type">Typ:</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="Wydatek">Wydatek</option>
              <option value="Dochód">Dochód</option>
              <option value="Oszczędność">Oszczędność</option>
              <option value="Inne">Inne</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Kwota:</label>
            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Opis:</label>
            <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Kategoria (opcjonalnie):</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="date">Data:</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <button type="submit" className="button">Dodaj wpis</button>
        </form>
      </Modal>
    </Card>
  );
}

export default Finance;