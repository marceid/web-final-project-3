const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:       {type: String, required: true},
  type:        {type: String, required: true},
  sku:         {type: String, required: true},
  brand:       {type: String, required: true},
  description: {type: String, required: true},
  price:       {type: Number, required: true},
  category:    {type: String, required: true},
  image:       {type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
