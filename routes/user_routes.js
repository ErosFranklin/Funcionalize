const express = require('express');
const { createUserController, getAuthenticatedUser } = require('../controllers/user_controller.js');
const { authenticateJWT } = require('../middleware/middleware_auth.js');

const router = express.Router();

router.post('/users', async (req, res) => {
    const data = req.body;

    if (!data || !data.name || !data.niche || !data.email || !data.password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = await createUserController(data);
    return res.status(result.statusCode || 500).json(result);
});
router.get('/user/:id', authenticateJWT, getAuthenticatedUser);

module.exports = router;
