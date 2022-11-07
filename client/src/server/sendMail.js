const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: "./.env" });

const EMAIL_USERNAME=process.env.EMAIL_USERNAME;
const PASSWORD=process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USERNAME,
      pass: PASSWORD
    },
    tls: {
      rejectUnauthorized: false
  }
  });
var mailConfigurations = {};

function setConfiguration(email, otp) {
  otp = " " + otp + " "
  mailConfigurations = {
    from: `LandRegistryGov <${EMAIL_USERNAME}>`,
    to: email,
    subject: 'Verification OTP',
    html: `<div style="display: inline; font-size: 1.5rem">Please Enter the OTP  ${otp}  for successful verification of your registry documents.</div>`
};
}

async function sendMail(res) {
transporter.sendMail(mailConfigurations, function(error, info){
  if (error)
    res.json({status: "error"});
  else
    res.json({status: "ok"});
});
}

module.exports = {
    setConfiguration: setConfiguration,
    sendMail: sendMail,
}