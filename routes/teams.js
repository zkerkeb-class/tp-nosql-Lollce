import express from 'express';
import mongoose from 'mongoose';
import Team from '../models/team.js';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

async function resolvePokemonIds(ids) {
    if (!ids?.length) return [];
    const result = [];
    for (const id of ids) {
        if (mongoose.Types.ObjectId.isValid(id) && String(id).length === 24) {
            result.push(id);
        } else {
            const num = Number.parseInt(id, 10);
            if (!Number.isNaN(num)) {
                const p = await Pokemon.findOne({ id: num }).select('_id');
                if (p) result.push(p._id);
            }
        }
    }
    return result;
}

router.post('/', async (req, res) => {
    try {
        const { name, pokemons = [] } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Le nom de l\'équipe est requis' });
        }
        if (pokemons.length > 6) {
            return res.status(400).json({ error: 'Une équipe ne peut pas contenir plus de 6 Pokémon' });
        }

        const resolvedIds = await resolvePokemonIds(pokemons);
        const team = await Team.create({
            user: req.user.id,
            name,
            pokemons: resolvedIds,
        });
        const populated = await Team.findById(team._id).populate('pokemons');
        return res.status(201).json(populated);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// GET /api/teams — Lister mes équipes
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find({ user: req.user.id }).populate('pokemons');
        return res.status(200).json(teams);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.id, user: req.user.id }).populate('pokemons');
        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        return res.status(200).json(team);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// PUT /api/teams/:id — Modifier une équipe
router.put('/:id', async (req, res) => {
    try {
        const { name, pokemons } = req.body;
        if (pokemons && pokemons.length > 6) {
            return res.status(400).json({ error: 'Une équipe ne peut pas contenir plus de 6 Pokémon' });
        }

        const update = {};
        if (name) update.name = name;
        if (pokemons) update.pokemons = await resolvePokemonIds(pokemons);

        const team = await Team.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            update,
            { new: true, runValidators: true }
        ).populate('pokemons');

        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        return res.status(200).json(team);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const team = await Team.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!team) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
