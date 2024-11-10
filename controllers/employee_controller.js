const Employee = require('../models/employee');
const logger = require('../logger/logger.js');

// Criar um funcionário
exports.createEmployee = async (req, res) => {

  logger.info("Criando um novo funcionário.");

  const employee = new Employee({
    ...req.body,
    user: req.user.id
  });

  try {
    const savedEmployee = await employee.save();
    logger.info(`O funcionário de nome ${savedEmployee.name} foi criado com sucesso e vinculado à empresa ${req.user.name}.`);
    res.status(201).json(savedEmployee);
  } catch (err) {
    logger.error(`Erro ao criar funcionário: ${err.message}`);
    res.status(400).json({ message: 'Erro ao criar funcionário: ' + err.message });
  }
};

// Buscar um funcionário pelo id
exports.getEmployeeById = async (req, res) => {
  const id = req.params.id;

  if (!req.user || !req.user.id) {
    logger.warn(`Tentativa de acesso sem autenticação para buscar funcionário com ID: ${id}`)
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  logger.info(`Buscando funcionário com ID: ${id}`);

  try {
    const employee = await Employee.findOne({ _id: id, user: req.user.id });

    if (!employee) {
      logger.warn(`Funcionário com ID ${id} não encontrado ou sem permissão de acesso pelo usuário logado`);
      return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão para buscá-lo' });
    }

    logger.info(`Funcionário encontrado: (nome) ${employee.name}; (idade) ${employee.age}; (salário) ${employee.salary}; (departamento) ${employee.department}`);
    res.status(200).json(employee);
  } catch (err) {
    logger.error(`Erro ao buscar funcionário com ID ${id}: ${err.message}`);
    res.status(500).json({ message: 'Erro ao buscar funcionário: ' + err.message });
  }
};

// Ler todos os funcionários
exports.getAllEmployees = async (req, res) => {
  logger.info(`Listando todos os funcionários da empresa ${req.user.name}.`);

  try {
    const employees = await Employee.find({ user: req.user.id });
    logger.info(`Funcionários encontrados.`);
    res.status(200).json(employees);
  } catch (err) {
    logger.error(`Erro ao buscar funcionários: ${err.message}`);
    res.status(500).json({ message: 'Erro ao buscar funcionários: ' + err.message });
  }
};

// Atualizar um funcionário
exports.updateEmployee = async (req, res) => {

  const idOutdatedEmployee = req.params.id;

  logger.info(`Atualizando o funcionário do ID ${idOutdatedEmployee}.`);

  try {
    const updateData = {
      name: req.body.name,
      age: parseInt(req.body.age),
      salary: parseFloat(req.body.salary),
      department: req.body.department
    };

    // Atualizando o funcionário no banco
    const employee = await Employee.findOneAndUpdate(
      { _id: idOutdatedEmployee, user: req.user.id },
      updateData,
      { new: true } // Retorna o documento atualizado
    );

    if (!employee){
      logger.warn(`Funcionário com ID ${idOutdatedEmployee} não encontrado ou sem permissão de acesso pelo usuário com ID ${req.user.id}`);
      return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão para alterá-lo' });
    }

    logger.info(`Funcionário com ID ${employee._id} atualizado com sucesso.`);
    res.status(200).json(employee);
  } catch (err) {
    logger.error(`Erro ao atualizar funcionário com ID ${idOutdatedEmployee}: ${err.message}`);
    res.status(400).json({ message: 'Erro ao atualizar funcionário: ' + err.message });
  }
};

// Deletar um funcionário
exports.deleteEmployee = async (req, res) => {
  const idDeletedEmployee = req.params.id;

  logger.info(`Deletando o funcionário do ID ${idDeletedEmployee}.`);

  try {
    const employee = await Employee.findOneAndDelete({ _id: idDeletedEmployee, user: req.user.id });

    if (!employee) {
      logger.warn(`Funcionário com ID ${idDeletedEmployee} não encontrado ou sem permissão de acesso pelo usuário com ID ${req.user.id}`);
      return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão para deletá-lo' });
    }

    logger.info(`Funcionário com ID ${employee._id} deletado com sucesso.`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Erro ao deletar funcionário com ID ${idDeletedEmployee}: ${err.message}`);
    res.status(500).json({ message: 'Erro ao deletar funcionário: ' + err.message });
  }
};

// Deletar todos os funcionários do usuário autenticado
exports.deleteAllEmployees = async (req, res) => {
  logger.info(`Deletando todos os funcionário da empresa ${req.user.name}.`);

  try {
    await Employee.deleteMany({ user: req.user.id }); // Deleta todos os funcionários do usuário
    logger.info(`Funcionários da empresa ${req.user.name} deletados com sucesso.`);
    res.status(204).send();
  } catch (err) {
    logger.error(`Erro ao deletar os funcionários da empresa ${req.user.name}: ${err.message}`);
    res.status(500).json({ message: 'Erro ao deletar todos os funcionários: ' + err.message });
  }
};