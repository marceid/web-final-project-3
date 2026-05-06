const mongoose = require('mongoose');

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


module.exports = { validateId };

