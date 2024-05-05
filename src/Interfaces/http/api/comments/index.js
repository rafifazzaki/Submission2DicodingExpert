const CommentHandler = require('./haldler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentHandler = new CommentHandler(container);
    server.route(routes(commentHandler));
  },
};
