const express = require('express');
const port = process.env.PORT || 8000
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.json({extended:true}));
let routes = require('./config/routes.js')
routes(app);

app.listen(port,()=>{
  console.log("Listening on Port:",port);
})
