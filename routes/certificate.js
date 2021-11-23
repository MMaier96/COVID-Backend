const express = require('express');
const router = express.Router();

const pdf = require("pdf-creator-node");
const fs = require("fs");
const nodemailer = require("nodemailer");
const HummusRecipe = require('hummus-recipe');

/* https://ethereal.email/ */

/* Post certificate listing. */
router.post('/', async (request, response) => {
  var html = fs.readFileSync("certificate-template.html", "utf8");

  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };

  var users = [
    {
      name: "Shyam",
      age: "26",
    },
    {
      name: "Navjot",
      age: "26",
    },
    {
      name: "Vitthal",
      age: "26",
    },
  ];
  var document = {
    html: html,
    data: {
      users: users,
    },
    path: "./output.pdf",
    type: "",
  };

  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });

    
  const pdfDoc = new HummusRecipe('output.pdf', 'output2.pdf');

  pdfDoc
    .encrypt({
        userPassword: '123',
        ownerPassword: '123',
        userProtectionFlag: 4
    })
    .endPDF();

  /* send email */

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "laurie.towne99@ethereal.email",
      pass: "G9z9M8xa586ajrN171",
    },
  });

  let info = await transporter.sendMail({
    from: '"Marcel Maier" <laurie.towne99@ethereal.email>', // sender address
    to: "developing.mmaier96@gmail.com", // list of receivers
    subject: "Zertifikat", // Subject line
    text: "test", // plain text body
    attachments: [{
      filename: 'zertifikat.pdf',
      path: 'output2.pdf',
      contentType: 'application/pdf'
    }],
    html: "test <b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log(request.body);
  response.send('works');
});

module.exports = router;
