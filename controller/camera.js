let knex = require('../db/knex.js');
let base64toFile =require("base64-to-file");
let axios = require('axios');
let apiKeyProsperent = 'dca27095b07a22b09b2434f27504265a';
module.exports={
  storeImage: function(req,res){
    // console.log("Recieved Store Image Request : \n---------",req,"\n---------")
    let {imgBase64} = req.body;
    imgBase64 = imgBase64.replace('data:image/jpeg;base64,','');
    // console.log("base64 : ", imgBase64);

    // base64toFile.convert(imgBase64 , 'productImg/' , ['jpg','jpeg','png'], function(filePath){
    //   console.log("Uploaded File to ", filePath);
    // })
    axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC61c6rn63fIVRP-W49siMGb7z7ev5PoHc',{
      "requests":[
        {
          "image":{
            "content": imgBase64
          } ,
          "features":[
            {
              "type": "TEXT_DETECTION",
              "maxResults":1
            }
          ]
        }
      ]
    })
    .then((result)=>{
      console.log(result.data.responses[0]);
      let responses = result.data.responses[0].textAnnotations;
      let extractedText = []
      if(typeof responses !== 'undefined'){
        responses.map(({description},indx)=>{
            extractedText.push(description)
            console.log(description);
        })
      }
      axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC61c6rn63fIVRP-W49siMGb7z7ev5PoHc',{
        "requests":[
          {
            "image":{
              "content": imgBase64
            } ,
            "features":[
              {
                "type": "LABEL_DETECTION",
                "maxResults":1
              }
            ]
          }
        ]
      })
      .then(({data})=>{
        let label = data.responses[0].labelAnnotations;
        console.log('LabelResponses : ',label)
        console.log(extractedText);
        let extractTextLines = [];
        if(extractedText.length > 0){
          console.log('extractedText == ', extractedText)
          extractedText[0].split('\n').map((line)=>{
            extractTextLines.push(line.split(' ').join('+').replace(',',''));
          });
          extractTextLines = extractTextLines.slice(0,3).join('+');
        }else{
          extractedTextLines = 'none';
        }
        // let labelApi = label[0].description.replace(' ', '+');
        let labelApi = label[0].description.split(' ')[0]
        console.log('extractedTextLines = ', extractTextLines);
        let apiUrl = `http://api.prosperent.com/api/search?query=${extractTextLines}&api_key=${apiKeyProsperent}`

        // let apiUrl = `http://api.prosperent.com/api/search?query=${labelApi}+${extractTextLines}&api_key=${apiKeyProsperent}`
        // let apiUrl = `http://api.prosperent.com/api/search?query=electronic+${extractTextLines}&api_key=${apiKeyProsperent}`
        axios.get(apiUrl)
        .then((result)=>{
          console.log('API CALL ', apiUrl)
          let productList = result.data
          console.log('Prosperent Api Response : ',productList);
          res.json({
            extractedText: extractedText,
            label: label ,
            matchedProducts: productList.data
          });
        })
        .catch((errProsperent)=>{
          console.log(errProsperent);
        })

      })
      .catch((err)=>{
        console.log("error",err);
      })
    })

  }
}
