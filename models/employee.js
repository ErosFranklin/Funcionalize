const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},   
  age: { 
    type: Number, 
    required: true 
},   
  salary: { 
    type: Number, 
    required: true 
},
  department: {
    type: String,
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', 
    required: true }     
}, {
  timestamps: true 
});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;