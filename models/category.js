const mongoose= require('mongoose');
var Schema = mongoose.Schema;


var categorySchema = new Schema ({
  title: {
    type : String,
    required: true
  },
  slug: {
    type : String
  }

});


var category = mongoose.model('category',categorySchema);
module.exports= category;
