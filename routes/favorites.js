import express from 'express';
import User from '../models/user.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('favorites');
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

        if (!user.favorites?.length) {
            return res.status(200).json({ favorites: [] });
        }

        const pokemons = await Pokemon.find({ id: { $in: user.favorites } });
        return res.status(200).json({ favorites: pokemons });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/:pokemonId', async (req, res) => {
    try {
        const pokemonId = Number.parseInt(req.params.pokemonId, 10);
        if (Number.isNaN(pokemonId)) {
            return res.status(400).json({ error: 'ID de Pokémon invalide' });
        }

        const exists = await Pokemon.findOne({ id: pokemonId });
        if (!exists) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { favorites: pokemonId },
        });

        const user = await User.findById(req.user.id).select('favorites');
        return res.status(200).json({ message: 'Favori ajouté', favorites: user.favorites });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:pokemonId', async (req, res) => {
    try {
        const pokemonId = Number.parseInt(req.params.pokemonId, 10);
        if (Number.isNaN(pokemonId)) {
            return res.status(400).json({ error: 'ID de Pokémon invalide' });
        }

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { favorites: pokemonId },
        });

        const user = await User.findById(req.user.id).select('favorites');
        return res.status(200).json({ message: 'Favori retiré', favorites: user.favorites });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
