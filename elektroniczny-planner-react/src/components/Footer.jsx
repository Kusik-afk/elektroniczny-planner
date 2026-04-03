// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer>
      <p>&copy; 2023 Elektroniczny Planner. Wszelkie prawa zastrzeżone.</p>
      <nav>
        <ul>
          <li><a href="#">Polityka Prywatności</a></li> {/* Na razie zwykłe linki */}
          <li><a href="#">Warunki Użytkowania</a></li>
        </ul>
      </nav>
    </footer>
  );
}

export default Footer;