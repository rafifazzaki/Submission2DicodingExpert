/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsMockHelper = {
  async mockAuthDummy(server) {
    const userDummy = {
      username: 'userDummy',
      password: 'passwordDummy',
      fullname: 'fullnameDummy',
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: userDummy.username,
        password: userDummy.password,
        fullname: userDummy.fullname,
      },
    });

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userDummy.username,
        password: userDummy.password,
      },
    });

    const authResponse = JSON.parse(auth.payload);

    return authResponse;
  },

  async cleanUsersTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = AuthenticationsMockHelper;
