var config= require('./config');

module.exports = {
  databaseurl : function() {
        return "mongodb://" + config.user + ":" + config.pwd + "@ds235180.mlab.com:35180/shopping-site";
  }
}
