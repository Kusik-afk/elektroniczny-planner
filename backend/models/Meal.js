const mongoose = require('mongoose');

const mealSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        dayOfWeek: { // Dzień tygodnia (np. "Poniedziałek", "Wtorek")
            type: String,
            required: [true, 'Proszę podać dzień tygodnia'],
            enum: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
        },
        mealType: { // Pora dnia (np. "Śniadanie", "Obiad", "Kolacja")
            type: String,
            required: [true, 'Proszę podać porę posiłku'],
            trim: true,
            minlength: [3, 'Pora posiłku musi mieć co najmniej 3 znaki'],
        },
        name: { // Nazwa posiłku (np. "Owsianka z owocami")
            type: String,
            required: [true, 'Proszę podać nazwę posiłku'],
            trim: true,
            minlength: [3, 'Nazwa posiłku musi mieć co najmniej 3 znaki'],
            maxlength: [100, 'Nazwa posiłku nie może przekraczać 100 znaków'],
        },
        calories: {
            type: Number,
            required: [true, 'Proszę podać kalorie'],
            min: [0, 'Kalorie nie mogą być ujemne'],
        },
        // Możemy dodać inne pola, np. składniki, makroelementy
        ingredients: {
            type: [String], // Tablica stringów
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;