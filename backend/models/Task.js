const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, // Referencja do użytkownika
            required: true,
            ref: 'User', // Odnosi się do modelu 'User'
        },
        name: {
            type: String,
            required: [true, 'Proszę podać nazwę zadania'],
            trim: true,
            minlength: [3, 'Nazwa zadania musi mieć co najmniej 3 znaki'],
            maxlength: [100, 'Nazwa zadania nie może przekraczać 100 znaków'],
        },
        description: { // Dodajemy opis zadania
            type: String,
            trim: true,
            maxlength: [500, 'Opis zadania nie może przekraczać 500 znaków'],
        },
        priority: {
            type: String,
            enum: ['niski', 'sredni', 'wysoki'], // Tylko te wartości są dozwolone
            default: 'niski',
        },
        completed: {
            type: Boolean,
            default: false,
        },
        dueDate: { // Dodajemy datę wykonania zadania
            type: Date,
            // required: [true, 'Proszę podać datę wykonania zadania'], // Możesz ustawić jako wymagane
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;