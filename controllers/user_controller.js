const User = require('../models/user.js');
const logger = require('../logger/logger.js');

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

        logger.info(`Usuário de nome ${newUser.name} e email ${newUser.email} criado com sucesso!`);
        return { message: 'Usuário criado com sucesso', user: newUser, statusCode: 201 }; 
    } catch (err) {
        logger.error(`Erro ao criar usuário: ${err.message}`);
        return { error: 'Erro interno do servidor', statusCode: 500 };
    }
};

// Buscar informações do usuário por ID
exports.getAuthenticatedUser = async (req, res) => {
    const userId = req.params.id;

    if (!req.user || req.user.id !== userId) {
        logger.warn(`Acesso negado: usuário não autenticado ou ID inválido.`);
        return res.status(403).json({ message: 'Acesso negado: Usuário não autenticado ou ID inválido' });
    }

    try {
        const user = await User.findById(userId).select('-password'); // Exclui a senha da resposta

        if (!user) {
            logger.warn(`Usuário de ID ${userId} não encontrado.`);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        logger.info(`Usuário de ID ${userId} encontrado com sucesso.`);
        res.status(200).json(user);
    } catch (err) {
        logger.error(`Erro ao buscar usuário: ${err.message}`);
        res.status(500).json({ message: 'Erro ao buscar usuário: ' + err.message });
    }
};
