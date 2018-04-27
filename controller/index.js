let knex = require('../db/knex.js');

module.exports={
  home: function(req,res){
    console.log(req.body);
    res.sendStatus(200);
  }
}
