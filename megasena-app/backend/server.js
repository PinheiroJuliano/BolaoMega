const express = require('express');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const { initializeDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco:', err);
        process.exit(1);
    });
