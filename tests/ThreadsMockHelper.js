/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsMockHelper = {
  async mockThreadDummy(server, auth) {
    const threadDummy = {
      title: 'titleDummy',
      body: 'bodyDummy',
    };

    const thread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: threadDummy.title,
        body: threadDummy.body,
      },
      headers: {
        Authorization: `Bearer ${auth.data.accessToken}`,
      },
    });

    const threadResponse = JSON.parse(thread.payload);

    return threadResponse.data.addedThread.id;
  },

  async cleanThreadsTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsMockHelper;
