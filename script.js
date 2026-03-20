// ----------------------------------------------------
// 1. Walidacja formularza logowania (login.html) - BEZ ZMIAN
// ----------------------------------------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        let isValid = true;
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');

        if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
            emailError.textContent = 'Proszę podać poprawny adres e-mail.';
            emailInput.classList.add('input-error');
            isValid = false;
        }
        if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Hasło musi mieć co najmniej 6 znaków.';
            passwordInput.classList.add('input-error');
            isValid = false;
        }
        if (isValid) {
            console.log('Formularz logowania poprawny. Wysyłam dane...');
            alert('Zalogowano pomyślnie (symulacja)!');
            window.location.href = 'dashboard.html';
        }
    });
}

// ----------------------------------------------------
// 2. Interaktywne rozwijane sekcje (dashboard.html) - BEZ ZMIAN
// ----------------------------------------------------
const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
collapsibleHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const section = this.closest('.collapsible-section');
        if (section) {
            section.classList.toggle('collapsed');
            const toggleIcon = this.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = section.classList.contains('collapsed') ? '+' : '-';
            }
        }
    });
});
collapsibleHeaders.forEach(header => {
    const section = header.closest('.collapsible-section');
    if (section && !section.classList.contains('collapsed')) {
        section.classList.add('collapsed');
        const toggleIcon = header.querySelector('.toggle-icon');
        if (toggleIcon) {
            toggleIcon.textContent = '+';
        }
    }
});


// ----------------------------------------------------
// 3. Proste liczniki treningów (dashboard.html) - BEZ ZMIAN
// ----------------------------------------------------
const incrementButtons = document.querySelectorAll('.button-increment');
let runningCount = 0;
let gymCount = 0;

if (localStorage.getItem('runningCount')) {
    runningCount = parseInt(localStorage.getItem('runningCount'));
    const runningCountElement = document.getElementById('runningCount');
    if (runningCountElement) runningCountElement.textContent = runningCount;
}
if (localStorage.getItem('gymCount')) {
    gymCount = parseInt(localStorage.getItem('gymCount'));
    const gymCountElement = document.getElementById('gymCount');
    if (gymCountElement) gymCountElement.textContent = gymCount;
}

incrementButtons.forEach(button => {
    button.addEventListener('click', function() {
        const type = this.dataset.type;
        if (type === 'running') {
            runningCount++;
            const runningCountElement = document.getElementById('runningCount');
            if (runningCountElement) runningCountElement.textContent = runningCount;
            localStorage.setItem('runningCount', runningCount);
        } else if (type === 'gym') {
            gymCount++;
            const gymCountElement = document.getElementById('gymCount');
            if (gymCountElement) gymCountElement.textContent = gymCount;
            localStorage.setItem('gymCount', gymCount);
        }
        console.log(`Licznik ${type}: ${type === 'running' ? runningCount : gymCount}`);
    });
});


// ----------------------------------------------------
// NOWE FUNKCJE DLA WERSJI OFFLINE PLANNERS
// ----------------------------------------------------

// Klasa dla zadań
class Task {
    constructor(name, priority, completed = false, id = Date.now()) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.completed = completed;
    }
}

// Klasa dla treningów
class Workout {
    constructor(type, duration, date, id = Date.now()) {
        this.id = id;
        this.type = type;
        this.duration = duration;
        this.date = date;
    }
}

// Klasa dla posiłków
class Meal {
    constructor(day, time, name, calories, id = Date.now()) {
        this.id = id;
        this.day = day;
        this.time = time;
        this.name = name;
        this.calories = calories;
    }
}

// Funkcja do pobierania danych z LocalStorage
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Funkcja do zapisywania danych do LocalStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ----------------------------------------------------
// 4. Zapisywanie zadań do LocalStorage i wyświetlanie
// ----------------------------------------------------

const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.getElementById('taskList');
let tasks = getFromLocalStorage('tasks'); // Pobieramy zadania przy starcie

function renderTasks() {
    if (!taskList) return; // Upewnij się, że element istnieje

    taskList.innerHTML = ''; // Czyścimy listę przed ponownym renderowaniem

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id; // Dodajemy ID do elementu listy

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));

        const span = document.createElement('span');
        span.textContent = `${task.name} (Priorytet: ${task.priority})`;
        if (task.completed) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#888';
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.classList.add('button-remove-item'); // Dodajemy klasę dla stylizacji
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function addTask(event) {
    event.preventDefault();
    const taskNameInput = document.getElementById('taskName');
    const taskPriorityInput = document.getElementById('taskPriority');

    if (taskNameInput.value.trim() === '') {
        alert('Nazwa zadania nie może być pusta!');
        return;
    }

    const newTask = new Task(taskNameInput.value, taskPriorityInput.value);
    tasks.push(newTask);
    saveToLocalStorage('tasks', tasks);
    renderTasks();
    addTaskForm.reset();
}

function toggleTaskCompleted(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveToLocalStorage('tasks', tasks);
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage('tasks', tasks);
    renderTasks();
}

if (addTaskForm) {
    addTaskForm.addEventListener('submit', addTask);
    renderTasks(); // Wyrenderuj zadania przy ładowaniu strony
}


// ----------------------------------------------------
// 5. Podgląd historii treningów
// ----------------------------------------------------

const addWorkoutForm = document.getElementById('addWorkoutForm');
const workoutHistoryDiv = document.getElementById('workoutHistory');
let workouts = getFromLocalStorage('workouts');

function renderWorkouts() {
    if (!workoutHistoryDiv) return;

    workoutHistoryDiv.innerHTML = '';

    if (workouts.length === 0) {
        workoutHistoryDiv.innerHTML = '<p>Brak zapisanych treningów.</p>';
        return;
    }

    // Sortujemy treningi od najnowszych
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedWorkouts.forEach(workout => {
        const article = document.createElement('article');
        article.classList.add('workout-entry'); // Klasa do stylowania
        article.dataset.id = workout.id;

        const h3 = document.createElement('h3');
        h3.textContent = workout.type;

        const p = document.createElement('p');
        p.textContent = `Dystans/Czas: ${workout.duration} min, Data: ${workout.date}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.classList.add('button-remove-item');
        deleteButton.addEventListener('click', () => deleteWorkout(workout.id));

        article.appendChild(h3);
        article.appendChild(p);
        article.appendChild(deleteButton);
        workoutHistoryDiv.appendChild(article);
    });
}

function addWorkout(event) {
    event.preventDefault();
    const workoutTypeInput = document.getElementById('workoutType');
    const workoutDurationInput = document.getElementById('workoutDuration');
    const workoutDateInput = document.getElementById('workoutDate');

    if (workoutTypeInput.value.trim() === '' || workoutDurationInput.value.trim() === '' || workoutDateInput.value.trim() === '') {
        alert('Proszę wypełnić wszystkie pola treningu!');
        return;
    }

    const newWorkout = new Workout(
        workoutTypeInput.value,
        parseInt(workoutDurationInput.value),
        workoutDateInput.value
    );
    workouts.push(newWorkout);
    saveToLocalStorage('workouts', workouts);
    renderWorkouts();
    addWorkoutForm.reset();
}

function deleteWorkout(id) {
    workouts = workouts.filter(workout => workout.id !== id);
    saveToLocalStorage('workouts', workouts);
    renderWorkouts();
}

if (addWorkoutForm) {
    addWorkoutForm.addEventListener('submit', addWorkout);
    renderWorkouts(); // Wyrenderuj treningi przy ładowaniu strony
}


// ----------------------------------------------------
// 6. Dodawanie posiłków do tygodniowego planu
// ----------------------------------------------------

const addMealForm = document.getElementById('addMealForm');
const mealPlanTableBody = document.querySelector('#mealPlanTable tbody');
let mealPlan = getFromLocalStorage('mealPlan');//pobranie danych z LocalStorage

function renderMealPlan() {
    if (!mealPlanTableBody) return;

    mealPlanTableBody.innerHTML = '';

    if (mealPlan.length === 0) {
        const row = mealPlanTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 5; // Zajmij całą szerokość tabeli
        cell.textContent = 'Brak posiłków w planie.';
        cell.style.textAlign = 'center';
        return;
    }

    // Opcjonalnie: posortuj posiłki według dnia tygodnia i pory dnia
    const daysOrder = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
    const sortedMealPlan = [...mealPlan].sort((a, b) => {
        const dayA = daysOrder.indexOf(a.day);
        const dayB = daysOrder.indexOf(b.day);
        if (dayA !== dayB) return dayA - dayB;
        return a.time.localeCompare(b.time); // Sortowanie alfabetyczne pory dnia
    });


    sortedMealPlan.forEach(meal => {
        const row = mealPlanTableBody.insertRow();
        row.dataset.id = meal.id;

        row.insertCell().textContent = meal.day;
        row.insertCell().textContent = meal.time;
        row.insertCell().textContent = meal.name;
        row.insertCell().textContent = `${meal.calories} kcal`;

        const actionsCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.classList.add('button-remove-item');
        deleteButton.addEventListener('click', () => deleteMeal(meal.id));
        actionsCell.appendChild(deleteButton);
    });
}

function addMeal(event) {
    event.preventDefault();
    const mealDayInput = document.getElementById('mealDay');
    const mealTimeInput = document.getElementById('mealTime');
    const mealNameInput = document.getElementById('mealName');
    const mealCaloriesInput = document.getElementById('mealCalories');

    if (mealDayInput.value.trim() === '' || mealTimeInput.value.trim() === '' || mealNameInput.value.trim() === '' || mealCaloriesInput.value.trim() === '') {
        alert('Proszę wypełnić wszystkie pola posiłku!');
        return;
    }

    const newMeal = new Meal(
        mealDayInput.value,
        mealTimeInput.value,
        mealNameInput.value,
        parseInt(mealCaloriesInput.value)
    );
    mealPlan.push(newMeal);
    saveToLocalStorage('mealPlan', mealPlan);
    renderMealPlan();
    addMealForm.reset();
}

function deleteMeal(id) {
    mealPlan = mealPlan.filter(meal => meal.id !== id);
    saveToLocalStorage('mealPlan', mealPlan);
    renderMealPlan();
}

if (addMealForm) {
    addMealForm.addEventListener('submit', addMeal);
    renderMealPlan(); // Wyrenderuj plan posiłków przy ładowaniu strony
}