// src/components/Finance.jsx
import React from 'react';
import Card from './Card';

function Finance() {
  const balance = 1234.50;
  const monthlyExpenses = 450.00;
  const savings = 200.00;

  return (
    <Card title="Podsumowanie Finansów" isCollapsible defaultCollapsed={false}>
      <p>Stan konta: <strong>{balance.toFixed(2)} PLN</strong></p>
      <p>Wydatki w tym miesiącu: {monthlyExpenses.toFixed(2)} PLN</p>
      <p>Oszczędności: {savings.toFixed(2)} PLN</p>
      <p><a href="#">Szczegóły finansowe</a></p>
    </Card>
  );
}

export default Finance;