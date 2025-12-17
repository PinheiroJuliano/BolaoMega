const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// CREATE - salvar jogo
router.post('/', auth, (req, res) => {
    const { name, numbers } = req.body;
    const date = new Date().toLocaleDateString();

    db.run(
        `INSERT INTO games (user_id, name, date, numbers)
         VALUES (?, ?, ?, ?)`,
        [req.user.id, name, date, JSON.stringify(numbers)],
        err => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao salvar jogo' });
            }
            res.json({ success: true });
        }
    );
});

// READ - listar jogos
router.get('/', auth, (req, res) => {
    db.all(
        `SELECT * FROM games WHERE user_id = ?`,
        [req.user.id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar jogos' });
            }
            res.json(rows);
        }
    );
});

// UPDATE - editar nome do jogo
router.put('/:id', auth, (req, res) => {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    db.run(
        `UPDATE games 
         SET name = ? 
         WHERE id = ? AND user_id = ?`,
        [name, id, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao atualizar jogo' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Jogo não encontrado' });
            }

            res.sendStatus(204);
        }
    );
});

// DELETE - excluir jogo
router.delete('/:id', auth, (req, res) => {
    db.run(
        `DELETE FROM games WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Erro ao excluir jogo' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Jogo não encontrado' });
            }

            res.json({ success: true });
        }
    );
});

module.exports = router;
