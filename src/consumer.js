require('dotenv').config();
const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./mail/MailSender');
const UsersService = require('./services/postgres/UsersService');
const VerificationsService = require('./services/postgres/VerificationsService');

const init = async () => {
  const usersService = new UsersService();
  const verificationsService = new VerificationsService();
  const mailSender = new MailSender();
  const listener = new Listener(verificationsService, usersService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:emailverifications', {
    durable: true,
  });

  await channel.assertQueue('export:forgotpassword', {
    durable: true,
  });

  channel.consume('export:emailverifications', listener.listen, {
    noAck: true,
  });

  channel.consume('export:forgotpassword', listener.newPassword, {
    noAck: true,
  });
};

init();
