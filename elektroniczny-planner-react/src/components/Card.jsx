// src/components/Card.jsx
import React from 'react';
import './Card.css'; // Importujemy style dla komponentu Card

function Card({ title, children, className = '', isCollapsible = false, defaultCollapsed = true }) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (isCollapsible) {
      setIsCollapsed(prev => !prev);
    }
  };

  // Używamy cardClassName jako głównej klasy dla sekcji
  const cardClassName = `card ${className} ${isCollapsible ? 'collapsible-section' : ''} ${isCollapsible && isCollapsed ? 'collapsed' : ''}`;

  return (
    <section className={cardClassName}>
      {title && (
        <h2 className={`card-title ${isCollapsible ? 'collapsible-header' : ''}`} onClick={toggleCollapse}>
          {title}
          {/* Zmieniamy ikonę na strzałki HTML entities */}
          {isCollapsible && <span className="toggle-icon">{isCollapsed ? '\u25B8' : '\u25BE'}</span>}
        </h2>
      )}
      <div className={isCollapsible ? 'collapsible-content' : ''}>
        {children}
      </div>
    </section>
  );
}

export default Card;