import mongoose from 'mongoose';

const TYPES = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dragon', 'Dark', 'Steel', 'Fairy',
];

const statSchema = {
    type: Number,
    min: [1, 'Chaque stat doit être entre 1 et 255'],
    max: [255, 'Chaque stat doit être entre 1 et 255'],
};

const pokemonSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: [true, 'L\'identifiant du Pokémon est requis'],
            unique: true,
            min: [1, 'L\'identifiant doit être un entier positif'],
            validate: {
                validator: Number.isInteger,
                message: 'L\'identifiant doit être un nombre entier',
            },
        },
        name: {
            english: { type: String, required: [true, 'Le nom anglais est requis'] },
            french: { type: String, required: [true, 'Le nom français est requis'] },
            japanese: { type: String },
            chinese: { type: String },
        },
        type: {
            type: [String],
            required: [true, 'Au moins un type est requis'],
            validate: {
                validator: function (v) {
                    return Array.isArray(v) && v.length > 0 && v.every((t) => TYPES.includes(t));
                },
                message: 'Types autorisés : ' + TYPES.join(', '),
            },
        },
        base: {
            HP: { type: Number, required: true, ...statSchema },
            Attack: { type: Number, required: true, ...statSchema },
            Defense: { type: Number, required: true, ...statSchema },
            SpecialAttack: { type: Number, ...statSchema },
            SpecialDefense: { type: Number, ...statSchema },
            Speed: { type: Number, required: true, ...statSchema },
        },
    },
    { timestamps: true }
);

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
