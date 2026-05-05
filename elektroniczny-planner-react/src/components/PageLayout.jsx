// src/components/PageLayout.jsx
import React from 'react';

function PageLayout({ title, children }) {
  return (
    <div className="page-layout"> {/* Nowa klasa CSS */}
      <main className="main-content"> {/* Używamy istniejących stylów main-content */}
        <h1 style={{ gridColumn: '1 / -1', marginBottom: 'var(--spacing-lg)' }}>{title}</h1>
        {children}
      </main>
    </div>
  );
}

export default PageLayout;