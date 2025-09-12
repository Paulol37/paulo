import Employee from "../models/Employee.js";

// Get all
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create
const createEmployee = async (req, res) => {
  const { name, position, department, salary } = req.body;
  try {
    const employee = await Employee.create({ name, position, department, salary });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
