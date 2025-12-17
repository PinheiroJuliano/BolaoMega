const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

app.listen(3000, () =>
    console.log('Backend rodando em http://localhost:3000')
);
