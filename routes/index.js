var express = require('express');
var router = express.Router();
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const PDFDocument = require('pdfkit');
const stream = require('stream');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/barcode',async (req,res,next)=>{

  const background = fs.readFileSync("public/images/bw.jpg");

  const buffer = await new AwesomeQR({
    text: req.query.hubid,
    size: 300,
    backgroundImage: background
  }).draw();

  fs.writeFileSync("qrcode.png", buffer);

  var img = Buffer.from(fs.readFileSync("qrcode.png"), 'base64');
  res.set({'Content-Type': 'image/gif', 'Content-Length': img.length});
  res.end(img);

    }
)

router.get('/print', async (req,res,next) => {

  const doc = new PDFDocument;
  //
  // doc.pipe(fs.createWriteStream('public/docs/ticket.pdf'));
  //
  // doc.end();
  res.send({
    print: "Your item is printing."
  })
})
module.exports = router;
