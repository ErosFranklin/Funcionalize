//Coloquem comentarios que mlk Esdras gosta
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Codigo para verificar a conexao com o MONGO
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para JSON
app.use(express.json());

// Rotas 
app.get('/', (req, res) => {
    res.send('API rodando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
