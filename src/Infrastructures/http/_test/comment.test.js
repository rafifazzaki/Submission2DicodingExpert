const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadsMockHelper = require('../../../../tests/ThreadsMockHelper');
const AuthenticationsMockHelper = require('../../../../tests/AuthenticationsMockHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const CommentMockHelper = require('../../../../tests/CommentsMockHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    describe('AuthorizationError', () => {
      it('should respond with 401 and throw AuthorizationError when not given authentication', async () => {
        // Arrange
        const requestPayload = {
          content: 'Comment Content',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {},
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.error).toEqual('Unauthorized');
        expect(responseJson.message).toEqual('Missing authentication');
      });
    });

    describe('ClientError: 400 (wrong data type and missing payload)', () => {
      it('should respond with 400 and throw ClientError when payload has wrong data type', async () => {
        // Arrange
        const requestPayload = {
          content: 123, // Wrong data type
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
        );
      });

      it('should respond with 400 and throw ClientError when payload is missing required properties', async () => {
        // Arrange
        const requestPayload = {};

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );
        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(400);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
        );
      });
    });

    describe('Server Error: 404 (Thread Not Found)', () => {
      it('should respond with 404 when the thread with the given threadId is not found', async () => {
        // Arrange
        const requestPayload = {
          content: 'Comment Content',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = 'nonexistentThreadId';

        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
      });
    });

    describe('Successful Creation: 201', () => {
      it('should respond with 201 and create a new comment', async () => {
        // Arrange
        const requestPayload = {
          content: 'Comment Content',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );
        // Action
        const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.message).toEqual('Comment posted successfully');
        expect(responseJson.data.addedComment).toBeDefined();
      });
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    describe('AuthorizationError', () => {
      it('should respond with 401 and throw AuthorizationError when not given authentication', async () => {
        // Arrange
        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );
        const commentId = await CommentMockHelper.mockCommentDummy(
          server,
          authentication,
          threadId,
        );

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {},
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(401);
        expect(responseJson.error).toEqual('Unauthorized');
        expect(responseJson.message).toEqual('Missing authentication');
      });
    });

    describe('Server Error: 404 (Thread Not Found)', () => {
      it('should respond with 404 when the thread with the given threadId is not found', async () => {
        // Arrange
        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );
        const commentId = await CommentMockHelper.mockCommentDummy(
          server,
          authentication,
          threadId,
        );

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/wrongId/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        expect(response.statusCode).toEqual(404);
      });
    });

    describe('Successful Deletion: 200', () => {
      it('should respond with 200 and delete the comment', async () => {
        // Arrange
        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);
        const threadId = await ThreadsMockHelper.mockThreadDummy(
          server,
          authentication,
        );
        const commentId = await CommentMockHelper.mockCommentDummy(
          server,
          authentication,
          threadId,
        );

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        expect(response.statusCode).toEqual(200);
      });
    });
  });
});
