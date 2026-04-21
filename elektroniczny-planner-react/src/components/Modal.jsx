// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Stworzymy ten plik CSS poniżej

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Jeśli modal nie jest otwarty, nic nie renderujemy

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Zatrzymujemy propagację, żeby kliknięcie w modal nie zamykało go */}
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body // Renderujemy modal bezpośrednio do body, żeby był zawsze na wierzchu
  );
}

export default Modal;