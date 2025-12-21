const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

/* REGISTER */
router.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;

    try {
        const hash = bcrypt.hashSync(password, 8);

        await db.query(
            `INSERT INTO users (name, email, password, phone, address)
             VALUES ($1, $2, $3, $4, $5)`,
            [name, email, hash, phone, address]
        );

        console.log(`Usuário registrado: ${email}`);

        res.json({ success: true });
    } catch (err) {
        console.error(err);

        // email duplicado
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

/* LOGIN */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Login inválido' });
        }

        const token = jwt.sign(
            { id: user.id },
            SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login' });
    }
});

module.exports = router;
