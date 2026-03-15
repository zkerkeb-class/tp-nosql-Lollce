import express from 'express';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const byType = await Pokemon.aggregate([
            { $unwind: '$type' },
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { type: '$_id', count: 1, _id: 0 } },
        ]);

        const avgHpByType = await Pokemon.aggregate([
            { $unwind: '$type' },
            { $group: { _id: '$type', avgHP: { $avg: '$base.HP' } } },
            { $sort: { avgHP: -1 } },
            { $project: { type: '$_id', avgHP: { $round: ['$avgHP', 2] }, _id: 0 } },
        ]);

        const maxAttack = await Pokemon.aggregate([
            { $sort: { 'base.Attack': -1 } },
            { $limit: 1 },
            { $project: { id: 1, name: 1, 'base.Attack': 1, _id: 0 } },
        ]);

        const maxHp = await Pokemon.aggregate([
            { $sort: { 'base.HP': -1 } },
            { $limit: 1 },
            { $project: { id: 1, name: 1, 'base.HP': 1, _id: 0 } },
        ]);

        return res.status(200).json({
            byType,
            avgHpByType,
            maxAttack: maxAttack[0] || null,
            maxHp: maxHp[0] || null,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
