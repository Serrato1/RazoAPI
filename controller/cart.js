let knex = require('../db/knex.js');

module.exports={
  all: function(req,res){
    knex("shopping_cart")
    .then((result)=>{
      console.log('result ',result);
      res.json({
        cart: result
      })
    })
  },
  addToCart: function(req,res){
    knex("shopping_cart")
    .insert({
      keyword : req.body.keyword,
      price : req.body.price,
      url : req.body.url,
      img : req.body.img
    })
    .then((result)=>{
      console.log('Successfully placed to shopping cart',result)
      res.sendStatus(200);
    })
  }
}
