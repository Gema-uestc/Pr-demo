var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodejs-demo');
exports.mongoose = mongoose;