const User = require('../models/user.js');

exports.createUserController = async (data) => {
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
// Buscar informações do usuário 
exports.getAuthenticatedUser = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'Usuário não autenticado' });
    }

    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclui a senha da resposta

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar usuário: ' + err.message });
    }
};
