// src/utils/models.js

export class Task {
    constructor(name, priority, completed = false, id = Date.now()) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.completed = completed;
    }
}

export class Workout {
    constructor(type, duration, date, id = Date.now()) {
        this.id = id;
        this.type = type;
        this.duration = duration;
        this.date = date;
    }
}

export class Meal {
    constructor(day, time, name, calories, id = Date.now()) {
        this.id = id;
        this.day = day;
        this.time = time;
        this.name = name;
        this.calories = calories;
    }
}