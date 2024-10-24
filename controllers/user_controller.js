const User = require('../models/user.js');
const bcrypt = require('bcrypt');

const createUserController = async (data) => {
    const { name, niche, email, password } = data;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: 'Email já está em uso' }, 400;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            niche,
            email,
            password: hashedPassword 
        });

        await newUser.save();

        return { message: 'Usuário criado com sucesso', user: newUser }, 201;
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        return { error: 'Erro interno do servidor' }, 500;
    }
};

module.exports = { createUserController };