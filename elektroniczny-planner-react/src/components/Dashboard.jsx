import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from 'react-router-dom';//outlet do renderowania zagnieżdżonych tras
import SideMenu from "./SideMenu";
import Tasks from './Tasks';
import Meals from './Meals';
import Training from './Training';
import Finance from './Finance';//stworzymy ten komponent później

function Dashboard() {
    //Tutaj możemy zarządzać globalnym stanem dashboardu, np. danymi użytkownika\
    const [userName, setUserName] = useState('Użytkowniku');

    //Przykład użycia useEffect - pobieranie danych użytkownika po załadowaniu komponentu
    useEffect(() => {
        //W prawdziwej aplikacji tutaj pobralibyśmy dane z API
        //Na razie symulacja
        const storedUserName = localStorage.getItem('currentUserName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            //Jeśli nie ma, ustawiamy domyślną i zapisujemy
            localStorage.setItem('currentUserName', 'Gościu');
            setUserName('Gościu');
        }
    }, []);//pusta tablica zależności - uruchomi się tylko raz po zamontowaniu

    return (
        <div className="dashboard-layot">
            <SideMenu />
            <main className="main-content">
                {/* Nagłówek powitalny dla dashboardu */}
                <h1 style={{ gridColumn: '1 / -1', marginBottom: 'var(--spacing-lg)'}}>Witaj, {userName}!</h1>
                
                {/* Routes dla zagnieżdżonych komponentów dashboardu */}
                <Routes>
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="meals" element={<Meals />} />
                    <Route path="training" element={<Training />} />
                    <Route path="finance" element={<Finance />} />
                    {/* Domyślna trasa dla dashboardu, jeśli nic nie jest wybrane */}
                    <Route path="/" element={
                        <>
                        {/* Tutaj możesz umieścić komponenty, które mają być widoczne domyślnie na dashboardzie */}
                        <Tasks />
                        <Meals />
                        <Training />
                        <Finance />
                        </>
                    } />
                </Routes>
                {/* <Outlet /> - jeśli chcesz renderować zagnieżdżone trasy w inny sposób */}
            </main>
        </div>
    );
}

export default Dashboard;