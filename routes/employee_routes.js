const express = require('express');
const {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  deleteAllEmployees
} = require('../controllers/employee_controller');
const { authenticateJWT } = require('../middleware/middleware_auth'); 

const router = express.Router();


router.post('/', authenticateJWT, createEmployee);

router.get('/', authenticateJWT, getAllEmployees);

router.put('/:id', authenticateJWT, updateEmployee);

router.delete('/:id', authenticateJWT, deleteEmployee); 

router.delete('/', authenticateJWT, deleteAllEmployees); 

module.exports = router;
