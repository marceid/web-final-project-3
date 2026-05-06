const Order   = require('../models/order.model');
const User    = require('../models/user.model');
const Product = require('../models/product.model');

exports.getOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'username email')
    .populate('products.product', 'title price')
    .sort({ createdAt: -1 });
  res.render('orders-list', { orders });
};

exports.getOrderDetails = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'username email')
    .populate('products.product', 'title price image sku');
  if (!order) return res.redirect('/orders-list');
  res.render('order-details', { order, isAdmin: req.user.role === 'admin' });
};

exports.getNewOrder = async (req, res) => {
  const [users, products] = await Promise.all([
    User.find().select('username email'),
    Product.find().select('title price sku').sort({ title: 1 })
  ]);
  res.render('new-order', { message: null, users, products });
};

exports.createOrder = async (req, res) => {
  const { userId, status, notes } = req.body;
  const productIds = [].concat(req.body.productIds || []);
  const quantities = [].concat(req.body.quantities  || []);

  if (!productIds.length || productIds.every(id => !id)) {
    const [users, products] = await Promise.all([
      User.find().select('username email'),
      Product.find().select('title price sku').sort({ title: 1 })
    ]);
    return res.render('new-order', { message: 'At least one product is required.', users, products });
  }

  const productItems = productIds
    .filter(id => id)
    .map((id, i) => ({ product: id, quantity: Math.max(1, parseInt(quantities[i]) || 1) }));

  const productDocs  = await Product.find({ _id: { $in: productItems.map(p => p.product) } });
  const totalAmount  = productItems.reduce((sum, item) => {
    const doc = productDocs.find(p => p._id.toString() === item.product.toString());
    return sum + (doc ? doc.price * item.quantity : 0);
  }, 0);

  await Order.create({ user: userId, products: productItems, status, notes, totalAmount });
  res.redirect('/orders-list');
};

exports.getEditOrder = async (req, res) => {
  const [order, users, products] = await Promise.all([
    Order.findById(req.params.id).populate('products.product', '_id title price sku'),
    User.find().select('username email'),
    Product.find().select('title price sku').sort({ title: 1 })
  ]);
  if (!order) return res.redirect('/orders-list');
  res.render('edit-order', { order, users, products });
};

exports.editOrder = async (req, res) => {
  const { userId, status, notes } = req.body;
  const productIds = [].concat(req.body.productIds || []);
  const quantities = [].concat(req.body.quantities  || []);

  const productItems = productIds
    .filter(id => id)
    .map((id, i) => ({ product: id, quantity: Math.max(1, parseInt(quantities[i]) || 1) }));

  const productDocs  = await Product.find({ _id: { $in: productItems.map(p => p.product) } });
  const totalAmount  = productItems.reduce((sum, item) => {
    const doc = productDocs.find(p => p._id.toString() === item.product.toString());
    return sum + (doc ? doc.price * item.quantity : 0);
  }, 0);

  await Order.findByIdAndUpdate(req.params.id, { user: userId, products: productItems, status, notes, totalAmount });
  res.redirect('/orders-list');
};

exports.deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.redirect('/orders-list');
};
