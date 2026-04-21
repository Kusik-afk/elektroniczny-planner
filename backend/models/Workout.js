const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: { // Rodzaj treningu (np. "Bieganie", "Siłownia", "Joga")
            type: String,
            required: [true, 'Proszę podać rodzaj treningu'],
            trim: true,
            minlength: [3, 'Rodzaj treningu musi mieć co najmniej 3 znaki'],
            maxlength: [100, 'Rodzaj treningu nie może przekraczać 100 znaków'],
        },
        duration: { // Czas trwania w minutach
            type: Number,
            required: [true, 'Proszę podać czas trwania treningu'],
            min: [1, 'Czas trwania musi być większy od 0'],
        },
        date: { // Data wykonania treningu
            type: Date,
            required: [true, 'Proszę podać datę treningu'],
        },
        distance: { // Dystans (opcjonalnie, np. dla biegania)
            type: Number,
            min: [0, 'Dystans nie może być ujemny'],
        },
        notes: { // Notatki do treningu
            type: String,
            trim: true,
            maxlength: [500, 'Notatki nie mogą przekraczać 500 znaków'],
        },
    },
    {
        timestamps: true,
    }
);

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;