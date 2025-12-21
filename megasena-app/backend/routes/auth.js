const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;


router.post('/register', (req, res) => {
    const { name, email, password, phone, address } = req.body;
    const hash = bcrypt.hashSync(password, 8);

    db.run(
        `INSERT INTO users (name,email,password,phone,address)
         VALUES (?,?,?,?,?)`,
        [name, email, hash, phone, address],
        err => {
            if (err) return res.status(400).json({ error: 'Usuário já existe' });
            res.json({ success: true });
        }
    );
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Login inválido' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Login inválido' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no login' });
    }
});

module.exports = router;
