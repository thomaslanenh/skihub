var express = require('express');
var router = express.Router();
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/barcode',async (req,res,next)=>{

  const background = fs.readFileSync("public/images/bw.jpg");

  const buffer = await new AwesomeQR({
    text: req.query.hubid,
    size: 500,
    backgroundImage: background
  }).draw();

  fs.writeFileSync("qrcode.png", buffer);

  const img = fs.readFileSync("qrcode.png");
  res.writeHead(200, {'Content-Type': 'image/gif'});
  res.end(img, 'binary');
})


router.get('/print', async (req,res,next) => {
  res.send({
    print: "Your item is printing."
  })
})
module.exports = router;
