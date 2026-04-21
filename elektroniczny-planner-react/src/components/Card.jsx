// src/components/Card.jsx
import React from 'react';

function Card({ title, children, className = '', isCollapsible = false, defaultCollapsed = true }) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (isCollapsible) {
      setIsCollapsed(prev => !prev);
    }
  };

  const cardClassName = `card ${className} ${isCollapsible ? 'collapsible-section' : ''} ${isCollapsible && isCollapsed ? 'collapsed' : ''}`;

  return (
    <section className={cardClassName}>
      {title && (
        <h2 className={`card-title ${isCollapsible ? 'collapsible-header' : ''}`} onClick={toggleCollapse}>
          {title}
          {isCollapsible && <span className="toggle-icon">{isCollapsed ? '+' : '-'}</span>}
        </h2>
      )}
      <div className={isCollapsible ? 'collapsible-content' : ''}>
        {children}
      </div>
    </section>
  );
}

export default Card;