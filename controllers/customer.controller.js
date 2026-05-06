const Customer = require('../models/customer.model');

exports.getNewCustomer = (req, res) => {
  res.render('new-customer', { message: null });
};

exports.createCustomer = async (req, res) => {
  const { name, email, phone, city, country } = req.body;
  const exists = await Customer.findOne({ email });
  if (exists) {
    return res.render('new-customer', { message: 'A customer with that email already exists.' });
  }
  await Customer.create({ name, email, phone, city, country });
  res.redirect('/customers-list');
};

exports.getCustomerDetails = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.redirect('/customers-list');
  res.render('customer-details', { customer, isAdmin: req.user.role === 'admin' });
};

exports.getCustomers = async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.render('customers-list', { customers });
};

exports.getEditCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.redirect('/customers-list');
  res.render('edit-customer', { customer });
};

exports.editCustomer = async (req, res) => {
  const { name, email, phone, city, country } = req.body;
  await Customer.findByIdAndUpdate(req.params.id, { name, email, phone, city, country });
  res.redirect('/customers-list');
};

exports.deleteCustomer = async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.redirect('/customers-list');
};
