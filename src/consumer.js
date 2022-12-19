require('dotenv').config();
const amqp = require('amqplib');
const Listener = require('./listener');
const MailSender = require('./mail/MailSender');
const VerificationsService = require('./services/postgres/VerificationsService');

const init = async () => {
  const verificationsService = new VerificationsService();
  const mailSender = new MailSender();
  const listener = new Listener(verificationsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:emailverifications', {
    durable: true,
  });

  channel.consume('export:emailverifications', listener.listen, {
    noAck: true,
  });
};

init();
