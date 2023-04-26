const nodemailer = require("nodemailer");
const sendEmail = (dist, link) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "Tamermansor371@gmail.com",
      pass: "nqtsykesjfdovain"
    }
  });
  const mailOptions = {
    from: "Tamermansor371@gmail.com",
    to: dist,
    subject: "Reset Password",
    text: `Do not share this link with any one  ${link}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = { sendEmail };
