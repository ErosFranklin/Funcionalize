const Employee = require('../models/employee');

// Criar um funcionário
exports.createEmployee = async (req, res) => {
    const employee = new Employee({
      ...req.body,
      user: req.user.id
    });
    
    try {
      const savedEmployee = await employee.save();
      res.status(201).json(savedEmployee);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao criar funcionário: ' + err.message });
    }
  };
 // Buscar um funcionário 
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params; 

  if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'Usuário não autenticado' });
  }

  try {
      const employee = await Employee.findOne({ _id: id, user: req.user.id });

      if (!employee) {
          return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão' });
      }
      
      res.json(employee);
  } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar funcionário: ' + err.message });
  }
};
  // Ler todos os funcionários
  exports.getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find({ user: req.user.id });
      res.json(employees);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar funcionários: ' + err.message });
    }
  };
  
  // Atualizar um funcionário
  exports.updateEmployee = async (req, res) => {
    try {
      const employee = await Employee.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { new: true }
      );
  
      if (!employee) {
        return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão' });
      }
  
      res.json(employee);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao atualizar funcionário: ' + err.message });
    }
  };
  
  // Deletar um funcionário
  exports.deleteEmployee = async (req, res) => {
    try {
      const employee = await Employee.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
  
      if (!employee) {
        return res.status(404).json({ message: 'Funcionário não encontrado ou você não tem permissão' });
      }
  
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Erro ao deletar funcionário: ' + err.message });
    }
  };
  
  // Deletar todos os funcionários do usuário autenticado
  exports.deleteAllEmployees = async (req, res) => {
    try {
      await Employee.deleteMany({ user: req.user.id }); // Deleta todos os funcionários do usuário
      res.status(204).send(); 
    } catch (err) {
      res.status(500).json({ message: 'Erro ao deletar todos os funcionários: ' + err.message });
    }
  };