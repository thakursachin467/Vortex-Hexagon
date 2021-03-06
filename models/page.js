const mongoose= require('mongoose');
var Schema = mongoose.Schema;


var pageSchema = new Schema ({
  title: {
    type : String,
    required: true
  },
  slug: {
    type : String
  },
  content: {
    type : String,
    required: true
  },
  sorting: {
    type : Number
  }

});


var page = mongoose.model('page',pageSchema);
module.exports= page;
