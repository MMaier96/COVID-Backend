const express = require('express');
const router = express.Router();
const fs = require("fs");
const crypto = require('crypto');

router.post('/', (request, response) => {
  const configuration = fs.readFileSync("configuration.json", "utf8");
  const {username, password} = request.body;
  
  const users = JSON.parse(configuration).users;

  const foundUser = users.find(user => user.username === username);

  const hashPW = crypto.createHash('sha256').update(password).digest('hex');
  
  if(hashPW === foundUser.password) 
    response.status(200).send({"success": true});
  else 
    response.status(401).send({"success": false});
});

module.exports = router;