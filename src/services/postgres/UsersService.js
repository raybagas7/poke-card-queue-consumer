const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyOnlyEmailAvailability(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Email not found');
    }
  }

  async updateOldPassword(email) {
    await this.verifyOnlyEmailAvailability(email);
    const newPassword = nanoid(8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = {
      text: 'UPDATE users SET password = $1 WHERE email = $2',
      values: [hashedPassword, email],
    };

    await this._pool.query(query);

    return newPassword;
  }
}

module.exports = UsersService;
