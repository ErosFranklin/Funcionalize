const user = require ('../models/user.js')
const jwt = require ('jsonwebtoken')

const loginController = async (data) => {
    const {email, password} = data;

    const user = await user.findOne ({email});

    if( !user || !(await user.verifyPassword(password))){
        return {error: 'Credenciais Invalidas'}, 401
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expire: '1h'})
    return {message: 'Sucesso no Login', token}, 200
};

const getUserData = async (req) => {
    const userId = req.user.id;
    const user = await UserActivation.findById(userId)

    if(!user){
        return {error: 'Usuário não encontrado'}, 404;
    }
}

module.expirts = {loginController, getUserData}