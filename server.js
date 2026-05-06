require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const customerRoutes = require('./routes/customer.routes');
const orderRoutes    = require('./routes/order.routes');
const rateLimit = require('express-rate-limit');
const cookieParser = require("cookie-parser");
const {populateUser} = require("./utils/auth");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 300,            // Limit each IP to 300 requests per `window`
  message: 'Too many requests.',
});

const app = express();

// Session middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true })); // parse form data
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(limiter);

app.use(cookieParser());


app.use(populateUser);


app.get('/', (req, res) => {
  res.redirect(req.user ? '/dashboard' : '/login');
});

app.use('/', productRoutes);
app.use('/', authRoutes);
app.use('/', usersRoutes);
app.use('/', customerRoutes);
app.use('/', orderRoutes);

mongoose
  .connect('mongodb+srv://Cluster12617:VVppc01QSXZO@cluster12617.l67hmef.mongodb.net/test?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error:', err));


app.listen(3000, () => console.log('Server running on port 3000'));
