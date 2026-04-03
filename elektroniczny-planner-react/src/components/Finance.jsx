// src/components/Finance.jsx
import React from 'react';

function Finance() {
  // Na razie proste dane, później rozbudujemy
  const balance = 1234.50;
  const monthlyExpenses = 450.00;
  const savings = 200.00;

  return (
    <section id="finanse" className="card collapsible-section">
      <h2 className="collapsible-header">Podsumowanie Finansów <span className="toggle-icon">-</span></h2>
      <div className="collapsible-content">
        <p>Stan konta: <strong>{balance.toFixed(2)} PLN</strong></p>
        <p>Wydatki w tym miesiącu: {monthlyExpenses.toFixed(2)} PLN</p>
        <p>Oszczędności: {savings.toFixed(2)} PLN</p>
        <p><a href="#">Szczegóły finansowe</a></p>
      </div>
    </section>
  );
}

export default Finance;