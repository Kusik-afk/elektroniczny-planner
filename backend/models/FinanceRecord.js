const mongoose = require('mongoose');

const financeRecordSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        type: { // Rodzaj wpisu (np. "Wydatek", "Dochód", "Oszczędność")
            type: String,
            required: [true, 'Proszę podać typ wpisu finansowego'],
            enum: ['Wydatek', 'Dochód', 'Oszczędność', 'Inne'],
        },
        amount: { // Kwota
            type: Number,
            required: [true, 'Proszę podać kwotę'],
            min: [0, 'Kwota nie może być ujemna'],
        },
        description: { // Opis wpisu
            type: String,
            required: [true, 'Proszę podać opis'],
            trim: true,
            minlength: [3, 'Opis musi mieć co najmniej 3 znaki'],
            maxlength: [200, 'Opis nie może przekraczać 200 znaków'],
        },
        category: { // Kategoria (np. "Jedzenie", "Transport", "Wynagrodzenie")
            type: String,
            trim: true,
            maxlength: [50, 'Kategoria nie może przekraczać 50 znaków'],
        },
        date: { // Data wpisu
            type: Date,
            required: [true, 'Proszę podać datę wpisu'],
        },
    },
    {
        timestamps: true,
    }
);

const FinanceRecord = mongoose.model('FinanceRecord', financeRecordSchema);

module.exports = FinanceRecord;