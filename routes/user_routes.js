const express = require('express');
const { createUserController } = require('../controllers/user_controller.js');

const router = express.Router();

router.post('/users', async (req, res) => {
    const data = req.body;

    if (!data || !data.name || !data.niche || !data.email || !data.password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const [response, statusCode] = await createUserController(data);
    return res.status(statusCode).json(response);
});

module.exports = router;