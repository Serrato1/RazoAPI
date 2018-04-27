let index = require('../controller/index.js');
let camera = require('../controller/camera.js');
let cart = require('../controller/cart.js');

module.exports =  function(app){
  app.get('/',index.home);
  app.post('/upload',camera.storeImage);

  app.get('/cart',cart.all);
  app.post('/cart',cart.addToCart);

}
