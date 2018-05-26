const mongoose= require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema ({
  title: {
    type : String,
    required: true
  },
  slug: {
    type : String
  },
  description: {
    type : String,
    required: true
  },
  category: {
    type : String,
    required: true
  },
  price: {
    type : Number,
    required: true
  },
  image: {
    type : String
  }

});


var products = mongoose.model('products',productSchema);
module.exports= products;
