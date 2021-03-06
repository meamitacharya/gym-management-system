const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const accessToken = oauth2Client.getAccessToken();

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken,
    expires: 1484314697598
  }
});

const sendEmail = async options => {
  const mailOptions = {
    from: 'Amit Acharya <kanxoo975@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
