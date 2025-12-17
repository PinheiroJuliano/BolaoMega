const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET = 'mega_sena_secret';

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

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email=?`, [email], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Login inválido' });
        }

        const token = jwt.sign({ id: user.id }, SECRET);
        res.json({ token });
    });
});

module.exports = router;
