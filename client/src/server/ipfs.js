const ipfsClient = require('ipfs-api')
const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const exec = require('child_process').exec;
const mail = require('./sendMail');

const app = express();
const server = http.createServer(app, {
  cors: {
        origin: "*",
      },
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(
    cors({
      origin: '*',
    })
  )
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/upload', async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
    
  const files = req.files;
  fs.writeFileSync('../docs/'+(files[0].name).toString(), files[0].data);
  const command = 'ipfs add ../docs/"'+(files[0].name).toString()+'"';
  var yourscript = exec(command,
        (error, stdout, stderr) => {
            const arr = stdout.split(" ");
            if (error !== null) {
                res.send({fileHash: "error"});
            }
            else {
              res.send({fileHash: arr[1].toString()});
            }
    });
});

app.post('/api/sendOTP', async (req, res) => {
  const { email, otp } = req.body;
res.header("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
res.setHeader("Access-Control-Allow-Credentials", true);

mail.setConfiguration(email, otp);
mail.sendMail(res);
})

server.listen(4000, () => {
    console.log("Server is listening on Port 4000");
})
