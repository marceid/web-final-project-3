const User = require('../models/user.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const bcrypt = require("bcrypt");
const {registerSchema, loginSchema} = require("../validators/authValidators");
const jwt = require("jsonwebtoken");


function saveUserInCookies(res, user) {
  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Store token in cookie
  res.cookie("token", token, { httpOnly: true });
}

exports.register = (req, res) => {
  res.render('register', { message: null });
};

exports.login = (req, res) => {
  res.render('login', {message: null});
};


exports.registerRequest = async (req, res) => {
  const { username, email, password } = req.body;
  const validation = registerSchema.validate({ username, email, password });
  if(validation.error) {
    return res.render('register', {message: validation.error});
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.render('register', {message: 'Email Taken'});
  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.render('register', {message: 'Username Taken'});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  saveUserInCookies(res, user);

  res.redirect('/dashboard');

};

exports.loginRequest = async (req, res) => {
  const { email, password } = req.body;
  const validation = loginSchema.validate({ email, password });
  if(validation.error) {
    return res.render('login', {message: validation.error});
  }
  const user = await User.findOne({ email });
  if (!user) return res.render('login', {message: 'No user found'});
  const same = await bcrypt.compare(password, user.password);
  if (!same) return res.render('login', {message: 'Invalid credentials'});

  saveUserInCookies(res, user);

  res.redirect('/dashboard');
};

exports.dashboard = async (req, res) => {
  const [customerCount, productCount, orderCount, recentCustomers, recentProducts, recentOrders] = await Promise.all([
    Customer.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Customer.find().sort({ createdAt: -1 }).limit(5),
    Product.find().sort({ createdAt: -1 }).limit(5),
    Order.find().sort({ createdAt: -1 }).limit(5)
      .populate('user', 'username')
      .populate('products.product', 'title'),
  ]);
  res.render('index', { user: req.user, customerCount, productCount, orderCount, recentCustomers, recentProducts, recentOrders });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect('/login');
};
