const mongoose = require('mongoose');
const databaseurl= require('../config/databseurl');

module.exports = {
    connectdatabase: function() {
      const database=databaseurl.databaseurl();
          mongoose.connect(database)
          .then(()=>{
            console.log(`database connected `);
          })
          .catch(()=>{
            console.log(`databse connection error`);
          });
    }
}
