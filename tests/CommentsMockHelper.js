/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentMockHelper = {
  async mockCommentDummy(server, auth, thread) {
    const commentDummy = {
      content: 'contentDummy',
    };

    const comment = await server.inject({
      method: 'POST',
      url: `/threads/${thread}/comments`,
      payload: {
        content: commentDummy.content,
      },
      headers: {
        Authorization: `Bearer ${auth.data.accessToken}`,
      },
    });

    const commentResponse = JSON.parse(comment.payload);

    return commentResponse.data.addedComment.id;
  },

  async cleanThreadsTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = CommentMockHelper;
