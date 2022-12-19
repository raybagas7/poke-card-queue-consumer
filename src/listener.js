class Listener {
  constructor(verificationsService, mailSender) {
    this._verificationsService = verificationsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail, trainer_name } = JSON.parse(
        message.content.toString()
      );

      const email = await this._verificationsService.addVerifyToken(userId);

      const result = await this._mailSender.sendEmail(
        targetEmail,
        trainer_name,
        JSON.stringify(email)
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = Listener;
