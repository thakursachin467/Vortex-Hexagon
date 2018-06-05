const mongoose= require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema ({
  name: {
    type : String,
    required: true
  },
  email: {
    type : String,
    required: true
  },
  password: {
    type : String,
    require:true
  },
  admin: {
    type: Boolean,
    required:true
  }

});


var user = mongoose.model('user',userSchema);
module.exports= user;
