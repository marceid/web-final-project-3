const Product = require('../models/product.model');
const multer = require('multer');
const path = require('path');
const {createProductSchema, updateProductSchema} = require("../validators/productValidators");
const {isUserAdmin} = require("../utils/auth");

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// New function to export for route, to use as middleware
exports.upload = upload.single('image');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  const isAdmin = isUserAdmin(req.user);
  res.render('all-products', {products, isAdmin});
};

exports.newProductForm = (req, res) => {
  res.render('new-product', {message: null});
};

exports.createProduct = async (req, res) => {
  const {title, type, sku, brand, description, price, category} = req.body;
  let image = null;
  if (req.file) {
    image = req.file.filename;
  }
  const validation = createProductSchema.validate({ title, type, sku, brand, description, price: Number(price), category, image });
  if(validation.error) {
    return res.render('new-product', {message: validation.error.details[0].message});
  }
  await Product.create({title, type, sku, brand, description, price: Number(price), category, image});
  res.redirect('/');
};

exports.getProductDetails = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const isAdmin = isUserAdmin(req.user);
  res.render('product-details', {product, isAdmin});
};

exports.editProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('edit-product', {product, message: null});
};

exports.updateProduct = async (req, res) => {
  const {title, type, sku, brand, description, price, category} = req.body;
  const updateData = {title, type, sku, brand, description, price: Number(price), category};

  if (req.file) {
    updateData.image = req.file.filename;
  }

  const validation = updateProductSchema.validate(updateData);
  if (validation.error) {
    const product = await Product.findById(req.params.id);
    return res.render('edit-product', {product, message: validation.error.details[0].message});
  }

  await Product.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/all-products');
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/all-products');
};
