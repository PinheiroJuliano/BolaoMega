const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE
router.post('/', auth, async (req, res) => {
    const { name, numbers } = req.body;
    const date = new Date().toLocaleDateString();

    try {
        await db.query(
            `INSERT INTO games (user_id, name, date, numbers)
             VALUES ($1, $2, $3, $4)`,
            [req.user.id, name, date, JSON.stringify(numbers)]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao salvar jogo' });
    }
});

// READ
router.get('/', auth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM games WHERE user_id = $1 ORDER BY id DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar jogos' });
    }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const result = await db.query(
        `UPDATE games
         SET name = $1
         WHERE id = $2 AND user_id = $3`,
        [name, id, req.user.id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    res.sendStatus(204);
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
    const result = await db.query(
        `DELETE FROM games WHERE id = $1 AND user_id = $2`,
        [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    res.json({ success: true });
});

module.exports = router;
