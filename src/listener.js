class Listener {
  constructor(verificationsService, usersService, mailSender) {
    this._verificationsService = verificationsService;
    this._usersService = usersService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
    this.newPassword = this.newPassword.bind(this);
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

  async newPassword(message) {
    try {
      const { targetEmail } = JSON.parse(message.content.toString());

      const newPassword = await this._usersService.updateOldPassword(
        targetEmail
      );

      const result = await this._mailSender.sendNewPassword(
        targetEmail,
        newPassword
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
