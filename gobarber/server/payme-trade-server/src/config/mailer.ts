import nodemailer from 'nodemailer';

const {
  MAIL_SMTP_SERVER,
  MAIL_SMTP_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
} = process.env;

const transport = nodemailer.createTransport({
  host: MAIL_SMTP_SERVER,
  port: Number(MAIL_SMTP_PORT),
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export default transport;
