const jwt = require('jsonwebtoken');
const Token = require('../models/token.js')
const User = require('../models/user.js');   
const bcrypt = require('bcrypt');

const loginController = async (data) => {
   
    const { email, password } = data;

    try {
        
        const user = await User.findOne({ email });
        if (!user) {
            return { error: 'Usuário não existe', statusCode: 401 };
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: 'Senha inválida', statusCode: 401 };
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
            type: "access", 
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const newToken = new Token({
            email: user.email,
            type: "access",
            user_id_sha: user._id,
            type_token: "access"
        });

        await newToken.save();

        return { message: 'Sucesso no Login', token, user, statusCode: 200 };
    } catch (err) {
        console.error('Error in loginController:', err);
        return { error: 'Internal server error', statusCode: 500 };
    }
};
const getUserData = async (user) => {
    try {
        const userData = await User.findById(user.id).select('-password'); 
        if (!userData) {
            return { error: 'Usuário não encontrado' }; 
        }
        return { user: userData }; 
    } catch (error) {
        throw new Error('Erro ao buscar dados do usuário'); 
    }
};

module.exports = { loginController, getUserData };
