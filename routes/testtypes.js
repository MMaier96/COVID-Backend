const express = require('express');
const router = express.Router();
const fs = require("fs");

/* Post certificate listing. */
router.get('/', async (request, response) => {
  const configuration = fs.readFileSync("configuration.json", "utf8");
  response.send(JSON.parse(configuration).COVIDTestTypes);
});

module.exports = router;