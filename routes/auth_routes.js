const express = require('express');
const { loginController, getUserData} = require('../controllers/auth_controller.js')
const {authenticateJWT} = require('../middleware/middleware_auth.js')

const router = express.Router()

router.post('/login', async (req, res) =>{
    const data = req.body;

    if(!data || !data.email || !data.password){
        return res.status(400).json({ error: 'Email ou senha inválidas'})
    }

    const [response, statusCode] =await loginController(data)
    return res.status(statusCode).json(response)
})

router.get('/data_user', authenticateJWT, async (req, res)=>{
    const [response, statusCode] = await getUserData(req)
    return res.status(statusCode).json(response)
})

module.exports = router;