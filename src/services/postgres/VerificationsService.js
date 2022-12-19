const { Pool } = require('pg');
const crypto = require('crypto');
const InvariantError = require('../../exceptions/InvariantError');

class VerificationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addVerifyToken(userId) {
    const queryVerify = {
      text: 'SELECT * FROM verifications WHERE owner = $1',
      values: [userId],
    };

    const resultVerify = await this._pool.query(queryVerify);

    if (resultVerify.rowCount) {
      return resultVerify.rows[0];
    }

    const randStringGenerator = crypto.randomBytes(64).toString('hex');
    const query = {
      text: 'INSERT INTO verifications VALUES($1, $2) RETURNING owner, token',
      values: [userId, randStringGenerator],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add new verifications token');
    }

    return result.rows[0];
  }
}

module.exports = VerificationsService;
