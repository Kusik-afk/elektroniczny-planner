const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Proszę podać adres e-mail'],
            unique: true, // Każdy e-mail musi być unikalny w kolekcji
            trim: true,   // Usuwa białe znaki na początku i końcu
            lowercase: true, // Zawsze przechowuj e-mail małymi literami
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Proszę podać poprawny adres e-mail',
            ],
        },
        password: { // Będziemy przechowywać zahashowane hasło
            type: String,
            required: [true, 'Proszę podać hasło'],
            minlength: [6, 'Hasło musi mieć co najmniej 6 znaków'],
        },
        // Możemy dodać inne pola, np. imię, nazwisko, preferencje użytkownika
        name: {
            type: String,
            default: 'Użytkownik',
            trim: true,
        },
    },
    {
        timestamps: true, // Automatycznie dodaje pola createdAt i updatedAt
    }
);

// Middleware Mongoose: hashuj hasło przed zapisaniem użytkownika
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { // Hashuj tylko, jeśli hasło zostało zmienione
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metoda Mongoose: porównaj wprowadzone hasło z zahashowanym
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;