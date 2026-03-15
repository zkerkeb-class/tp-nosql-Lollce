import express from 'express';
import Pokemon from '../models/pokemon.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { type, name, sort } = req.query;

        const filter = {};

        if (type) {
            filter.type = type;
        }

        if (name) {
            filter['name.english'] = { $regex: name, $options: 'i' };
        }

        const page = Number.parseInt(req.query.page, 10) || 1;
        const limit = Number.parseInt(req.query.limit, 10) || 50;
        const skip = (page - 1) * limit;

        let query = Pokemon.find(filter);

        if (sort) {
            query = query.sort(sort);
        }

        query = query.skip(skip).limit(limit);

        const [pokemons, total] = await Promise.all([
            query.exec(),
            Pokemon.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return res.status(200).json({
            data: pokemons,
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);
        const pokemon = await Pokemon.findOne({ id });

        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        return res.status(200).json(pokemon);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const pokemon = await Pokemon.create(req.body);
        return res.status(201).json(pokemon);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);

        const updatedPokemon = await Pokemon.findOneAndUpdate(
            { id },
            req.body,
            { new: true }
        );

        if (!updatedPokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        return res.status(200).json(updatedPokemon);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10);

        const deletedPokemon = await Pokemon.findOneAndDelete({ id });

        if (!deletedPokemon) {
            return res.status(404).json({ error: 'Pokémon non trouvé' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;

