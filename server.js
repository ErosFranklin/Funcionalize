require('dotenv').config();
const express = require('express');
const connectDB = require('./mongo/db_mongo.js'); 
const cors = require('cors');
const authRoutes = require('./routes/auth_routes.js');
const userRoutes = require('./routes/user_routes.js'); 
const employeeRoutes = require('./routes/employee_routes');


const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(cors()); 
app.use(express.json());

//Uso das rotas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/employees', employeeRoutes);

app.get('/', (req, res) => {
    res.send('API rodando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
