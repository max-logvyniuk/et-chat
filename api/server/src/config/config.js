require('dotenv').config();

module.exports = {
  development: {
    environment:process.env.NODE_ENV,
    amqp: process.env.CLOUDAMQP_URL,
    queue: 'nodemailer-amqp',
    emailName: process.env.EMAIL_NAME,
    emailPass: process.env.EMAIL_PASS,
    portMailer: process.env.PORT_MAILER,
    hostMailer:process.env.HOST_MAILER,
    mailerClientId:process.env.MAILER_CLIENT_ID,
    mailerClientSecret:process.env.MAILER_CLIENT_SECRET,
    mailerRefreshToken:process.env.MAILER_REFRESH_TOCKEN,
    serverUserId:Number(process.env.SERVER_USER_ID),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    cloudinaryName:process.env.CLOUDINARY_NAME,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET,

  },

  test: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },

  production: {
    environment:process.env.NODE_ENV,
    amqp: process.env.CLOUDAMQP_URL,
    queue: process.env.QUEUE,
    emailName: process.env.EMAIL_NAME,
    emailPass: process.env.EMAIL_PASS,
    portMailer: process.env.PORT_MAILER,
    hostMailer:process.env.HOST_MAILER,
    mailerAccessToken: process.env.MAILER_ACCESS_TOKEN,
    mailerClientId:process.env.MAILER_CLIENT_ID,
    mailerClientSecret:process.env.MAILER_CLIENT_SECRET,
    mailerRefreshToken:process.env.MAILER_REFRESH_TOCKEN,
    mailerAccessUrl:process.env.MAILER_ACCESS_URL,
    serverUserId:Number(process.env.SERVER_USER_ID),
    databaseUrl: process.env.DATABASE_URL,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    cloudinaryName:process.env.CLOUDINARY_NAME,
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET,
  }
};
