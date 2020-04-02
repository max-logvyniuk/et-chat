require('dotenv').config();


module.exports = {

  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    // amqp: {
    //   protocol: 'amqp',
    //   hostname: 'localhost',
    //   port: 5672,
    //   username: 'guest',
    //   password: 'guest',
    //   locale: 'en_US',
    //   frameMax: 1000,
    //   heartbeat: 0,
    //   vhost: '/',
    // },
    amqp: process.env.AMQP,
    queue: 'nodemailer-amqp',
    emailName: process.env.EMAIL_NAME,
    emailPass: process.env.EMAIL_PASS,
    portMailer: process.env.PORT_MAILER,
    hostMailer:process.env.HOST_MAILER,
    serverUserId:Number(process.env.SERVER_USER_ID),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },

  test: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },

  production: {
    amqp: process.env.AMQP,
    queue: 'nodemailer-amqp',
    emailName: process.env.EMAIL_NAME,
    emailPass: process.env.EMAIL_PASS,
    portMailer: process.env.PORT_MAILER,
    hostMailer:process.env.HOST_MAILER,
    serverUserId:Number(process.env.SERVER_USER_ID),
    databaseUrl: process.env.DATABASE_URL,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};
