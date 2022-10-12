var express = require('express');
var router = express.Router();
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const PDFDocument = require('pdfkit');
const stream = require('stream');
const axios = require('axios');

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

  await fs.writeFileSync(`qrcode${req.query.hubid}.png`, buffer);

  var img = Buffer.from(fs.readFileSync("qrcode.png"), 'base64');

  res.set({'Content-Type': 'image/gif', 'Content-Length': img.length});
  res.end(img);

    }
)

router.get('/print', async (req,res,next) => {

  const doc = new PDFDocument({autoFirstPage: false, bufferPages: true, layout: 'landscape', size: 'A5'});

  const datestamp = parseInt(req.query.expirationdate);
  var date = new Date(datestamp);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate() + 1;

  console.log(date)


  let buffers = [];



  const background = fs.readFileSync("public/images/bw.jpg");

  const buffer = await new AwesomeQR({
    text: req.query.hubid,
    size: 300,
    backgroundImage: background
  }).draw();

  await fs.writeFileSync(`qrcode${req.query.hubid}.png`, buffer);

  var img = Buffer.from(fs.readFileSync("qrcode.png"), 'base64');


  doc.pipe(fs.createWriteStream('public/docs/ticket.pdf'));

  doc.on('data', buffers.push.bind(buffers));

  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(pdfData),
      'Content-Type': "application/pdf",
      'Content-disposition': `attachment;filename=${req.query.hubid}.pdf`,
    })
        .end(pdfData)
  })

doc.addPage({
  margins: { top: 0, left: 0, right: 0, bottom: 0},
  layout: "landscape",
  size: "A5"
})
  var img = Buffer.from(fs.readFileSync(`qrcode${req.query.hubid}.png`), 'base64');
  doc.image(img, (doc.page.width - 900 / 2));
  doc.fontSize(20);
  doc.text(`${req.query.passtype}`, 0, 300, { align: 'center'})
  doc.fontSize(15);
  doc.text(`${req.query.firstname} ${req.query.lastname}`, {align: 'center'})
  doc.fontSize(10);
  doc.text(`Expires: ${month}/${day}/${year}`, {align: 'center'})
  doc.end();

  // res.send({
  //   print: "Your item is printing."
  // })
})
module.exports = router;
