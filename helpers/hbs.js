module.exports={
  check : function(value1,value2) {

    if(value1==value2) {
      return true;
    }
    else {
      return false;
    }
  },
  truncate :function(str,len){
    if (str.length > len && str.length > 0) {
  			var new_str = str + " ";
  			new_str = str.substr(0, len);
  			new_str = str.substr(0, new_str.lastIndexOf(" "));
  			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
  			return new_str + '...';
  		}
  		return str;
    },
    striptag: function(input){
      return input.replace(/<(?:.|\n)*?>/gm, ' ');

    },
    checkarray: function(value1){
      if( value1==undefined ) {
        return false;
      }
      else if (value1.length!=0 ) {
          return true;
      }
      else {
        return false;
      }
    },
    Subtotal: function(value1,value2) {
      return (value1* value2).toFixed(2);
    },
    total:function(value) {
          let total=0;
          if(value== undefined) {
            return 0;
          } else {
            for(var i=0;i<value.length;i++) {
              total=  total + value[i].quantity * value[i].price;
            }
          }
          return total;
    },
    currency:function(value) {
      return value/65;
    },
    inc: function(value) {
      return value+1;
    }



}
