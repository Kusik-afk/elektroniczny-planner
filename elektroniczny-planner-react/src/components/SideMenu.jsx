// src/components/SideMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink automatycznie dodaje klasę 'active'

function SideMenu() {
  return (
    <aside className="side-menu">
      <nav>
        <ul>
          <li><NavLink to="/dashboard/tasks">Zadania</NavLink></li>
          <li><NavLink to="/dashboard/meals">Posiłki</NavLink></li>
          <li><NavLink to="/dashboard/training">Treningi</NavLink></li>
          <li><NavLink to="/dashboard/finance">Finanse</NavLink></li>
          <li><NavLink to="/dashboard/settings">Ustawienia</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideMenu;