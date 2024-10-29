const User = require('../models/user.js');

const createUserController = async (data) => {
    const { name, niche, email, password } = data;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'Email já está em uso', statusCode: 400 }; // Retornando como objeto
        }
        
        const newUser = new User({
            name,
            niche,
            email,
            password
        });

        await newUser.save();

        return { message: 'Usuário criado com sucesso', user: newUser, statusCode: 201 }; 
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        return { error: 'Erro interno do servidor', statusCode: 500 }; 
    }
};

module.exports = { createUserController };
