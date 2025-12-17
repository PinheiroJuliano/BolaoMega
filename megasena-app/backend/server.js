const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

app.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});
