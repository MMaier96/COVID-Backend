const express = require('express');
const router = express.Router();

const pdf = require("pdf-creator-node");
const fs = require("fs");
const nodemailer = require("nodemailer");
const HummusRecipe = require('hummus-recipe');

/* https://ethereal.email/ */

router.post('/', async (request, response) => {

  console.log(`[Info] New request received with content: \n${JSON.stringify(request.body)}`);

  const configuration = fs.readFileSync("configuration.json", "utf8");
  const html = fs.readFileSync("template/certificate-template.html", "utf8");

  const htmlData = { ...request.body, "Oranisation": JSON.parse(configuration).Oranisation};

  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };

  const document = {
    html: html,
    data: htmlData,
    path: `./certificates/created/${htmlData.testdatum}_${htmlData.nachname}-${htmlData.vorname}certificate.pdf`,
    type: "",
  };

  pdf.create(document, options)
    .then((res) => {

      console.log(`\n[INFO]: Document was created!\n${JSON.stringify(res)}\n`);

      const pdfDoc = new HummusRecipe(res.filename, 'output2.pdf');

      pdfDoc
        .encrypt({
          userPassword: htmlData.Geburtstag,
          ownerPassword: htmlData.Geburtstag,
          userProtectionFlag: 4
        })
        .endPDF();

      console.log(`\n[INFO]: Document was successfully encrypted!\noutput2.pdf\n`);

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "laurie.towne99@ethereal.email", // dummy account
          pass: "G9z9M8xa586ajrN171", // dummy account
        },
      });

      console.log(`\n[INFO]: Mail transport was created!\n`);

      transporter.sendMail({
        from: '"Laurie Towne" <laurie.towne99@ethereal.email>', 
        to: "testmail@gmail.com", 
        subject: "Zertifikat", 
        text: "test", 
        attachments: [{
          filename: 'Testergebnis_Zertifikat.pdf',
          path: 'output2.pdf',
          contentType: 'application/pdf'
        }],
        html: "test <b>Hello world?</b>", // html body
      }).then(info => {
        console.log(`\n[INFO]: Mail was sent!\n${JSON.stringify(info)}\n`);
        response.send('works');
      })
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;