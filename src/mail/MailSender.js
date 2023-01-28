const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this._transporter.use(
      'compile',
      hbs({
        viewEngine: 'express-handlebars',
        viewPath: './views/',
      })
    );
  }

  sendEmail(targetEmail, trainer_name, content) {
    const { owner, token } = JSON.parse(content);
    const link = `http://18.138.255.1:5000/verify/email/${owner}/${token}`;

    const message = {
      from: 'Pokecard',
      to: targetEmail,
      subject: 'Email Verifications',
      // text: `Ini link nya http://localhost:5000/email/verify/${owner}/${token}`,
      template: 'main',
      context: {
        link,
        trainer_name,
      },
    };

    return this._transporter.sendMail(message);
  }

  sendNewPassword(targetEmail, newPassword) {
    const message = {
      from: 'Pokecard',
      to: targetEmail,
      subject: 'Forgot Password',
      text: `${newPassword}`,
      template: 'main',
      context: {
        newPassword,
      },
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_ADDRESS,
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// const mailOptions = {
//   from: 'pokecardagas@gmail.com',
//   to: 'raymy.gas@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'Testing for sure',
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
