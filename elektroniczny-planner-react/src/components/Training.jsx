import React, { useState, useEffect } from "react";

class Workout {
    constructor(type, duration, date, id = Date.now()) {
        this.id = id;
        this.type = type;
        this.duration = duration;
        this.date = date;
    }
}

function Training() {
    const [workouts, setWorkouts] = useState([]);
    const [workoutType, setWorkoutType] = useState('');
    const [workoutDuration, setWorkoutDuration] = useState('');
    const [workoutDate, setWorkoutDate] = useState('');

    //Liczniki z poprzedniego kroku
    const [runningCount, setRunningCount] = useState(() => parseInt(localStorage.getItem('runningCount')) || 0);
    const [gymCount, setGymCount] = useState(() => parseInt(localStorage.getItem('gymCount')) || 0);

    useEffect(() => {
        const storedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
        setWorkouts(storedWorkouts);
    }, []);

    useEffect(() => {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }, [workouts]);

    //Efekty dla liczników
    useEffect(() => {
        localStorage.setItem('runningCount', runningCount.toString());
    }, [gymCount]);

    const handleAddWorkout = (event) => {
        event.preventDefault();
        if (workoutType.trim() === '' || workoutDuration.trim() === '' || workoutDate.trim() === '') {
            alert('Proszę wypełnić wszystkie pola treningu!');
            return;
        }
        const newWorkout = new Workout(workoutType, parseInt(workoutDuration), workoutDate);
        setWorkouts([...workouts, newWorkout]);
        setWorkoutType('');
        setWorkoutDuration('');
        setWorkoutDate('');
    };

    const handleDeleteWorkout = (id) => {
        setWorkouts(workouts.filter(workout => workout.id !== id));
    };

    const handleIncrement = (type) => {
        if (type === 'running') {
            setRunningCount(prev => prev +1);
        } else if (type === 'gym') {
            setGymCount(prev => prev + 1);
        }
    };

    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <section id="treningi" className="card collapsible-section">
            <h2 className="collapsible-header">Twoje treningi <span className="toggle-icon">-</span></h2>
            <div className="collapsible-content">
                <h3>Dodaj nowy trening</h3>
                <form onSubmit={handleAddWorkout}>
                    <div className="form-group">
                        <label htmlFor="workoutType">Rodzaj treningu:</label>
                        <input  
                            type="text"
                            id="workoutType"
                            value={workoutType}
                            onChange={(e) => setWorkoutType(e.target.value)}
                            required
                            placeholder="np. Bieganie, Siłownia"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="workoutDuration">Czas (minuty):</label>
                        <input
                            type="number"
                            id="workoutDuration"
                            value={workoutDuration}
                            onChange={(e) => setWorkoutDuration(e.target.value)}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="wourkoutDate">Data:</label>
                        <input
                            type="date"
                            id="workoutDate"
                            value={workoutDate}
                            onChange={(e) => setWorkoutDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="button">Zapisz trening</button>
                </form>

                <h3>Historia treningów:</h3>
                <div id="workoutHistory">
                    {sortedWorkouts.length === 0 ? (
                        <p>Brak zapisanych treningów.</p>
                    ) : (
                        sortedWorkouts.map(workout => (
                            <article key={workout.id} className="workout-entry">
                                <div>
                                    <h3>{workout.type}</h3>
                                    <p>Czas: {workout.duration} min, Data: {workout.date}</p>
                                </div>
                                <button className="button-remove-item" onClick={() => handleDeleteWorkout(workout.id)}>Usuń</button>
                            </article>
                        ))
                    )}
                </div>

                <h3>Szybkie liczniki:</h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <h4>Bieganie</h4>
                        <p>Ilość biegów: <span id="runningCount">{runningCount}</span></p>
                        <button className="button" onClick={() => handleIncrement('running')}>Dodaj bieg</button>
                    </div>
                    <div className="card" style={{ flex: 1, textAlign: 'center' }}>
                        <h4>Siłownia</h4>
                        <p>Ilość treningów: <span id="gymCount">{gymCount}</span></p>
                        <button className="button" onClick={() => handleIncrement('gym')}>Dodaj trening</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Training;