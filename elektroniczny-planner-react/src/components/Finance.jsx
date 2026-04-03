import React from "react";

function Finance() {
    //Na razie proste dane, później rozbudujemy
    const balance = 1234.50;
    const monthlyExpenses = 450.00;
    const saving = 200.00;

    return (
        <section id="finance" className="card collapsible-section">
            <h2 className="collapsible-header">Podsumowanie finasów <span className="toggle-icon">-</span></h2>
            <div className="collapsible-content">
                <p>Stan konta: <strong>{balance.toFixed(2)} PLN</strong></p>
                <p>Wydatki w tym miesiącu: {monthlyExpenses.toFixed(2)} PLN</p>
                <p>Oszczędności: {SVGAnimatedLengthList.toFixed(2)} PLN</p>
                <p><a href="#">Szczegóły finansowe</a></p>
            </div>
        </section>
    );
}

export default Finance;