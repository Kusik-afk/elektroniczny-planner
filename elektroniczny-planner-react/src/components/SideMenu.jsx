// src/components/SideMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function SideMenu() {
  return (
    <aside className="side-menu">
      <nav>
        <ul>
          <li><NavLink to="/dashboard">Dashboard (Ogólny)</NavLink></li> {/* Link do ogólnego dashboardu */}
          <li><NavLink to="/dashboard/tasks">Zadania</NavLink></li>
          <li><NavLink to="/dashboard/meals">Posiłki</NavLink></li>
          <li><NavLink to="/dashboard/training">Treningi</NavLink></li>
          <li><NavLink to="/dashboard/finance">Finanse</NavLink></li>
          <li><NavLink to="/weekly-meal-plan">Tygodniowy Plan Posiłków</NavLink></li> {/* Nowy link */}
          <li><NavLink to="/dashboard/settings">Ustawienia</NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}

export default SideMenu;