import 'dotenv/config';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import connectDB from './connect.js';
import Pokemon from '../models/pokemon.js';

try {
    await connectDB();

    const raw = readFileSync(new URL('../data/pokemons.json', import.meta.url));
    const pokemons = JSON.parse(raw.toString());

    await Pokemon.deleteMany({});
    console.log('Collection vidée.');

    const result = await Pokemon.insertMany(pokemons);
    console.log(`${result.length} Pokémon insérés avec succès !`);
} catch (err) {
    console.error('Erreur lors du seed :', err);
} finally {
    await mongoose.connection.close();
    console.log('Connexion fermée.');
}

