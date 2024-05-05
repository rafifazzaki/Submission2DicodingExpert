const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const AuthenticationsMockHelper = require('../../../../tests/AuthenticationsMockHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    describe('AuthorizationError', () => {
      it('should respond with 401 and throw AuthorizationError when not given authentication', async () => {
        // Arrange
        const requestPayload = {
          title: 'Thread Title',
          body: 'Thread Body',
        };

        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
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
          title: 123, // Wrong data type
          body: 'threadBody',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
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
          'tidak dapat membuat thread baru karena tipe data tidak sesuai',
        );
      });

      it('should respond with 400 and throw ClientError when payload is missing required properties', async () => {
        // Arrange
        const requestPayload = {
          body: 'threadBody',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
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
          'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
        );
      });
    });

    describe('Successful Creation: 201', () => {
      it('should respond with 201 and create a new thread', async () => {
        // Arrange
        const requestPayload = {
          title: 'threadTitle',
          body: 'threadBody',
        };

        const server = await createServer(container);
        const authentication =
          await AuthenticationsMockHelper.mockAuthDummy(server);

        // Action
        const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${authentication.data.accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(201);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.message).toEqual('Thread posted successfully');
        expect(responseJson.data.addedThread).toBeDefined();
      });
    });
  });
  describe('GET /threads/{threadId}', () => {
    describe('Successful retrieval: 200', () => {
      it('should respond with 200 and retrieve the thread along with its comments', async () => {
        // Arrange
        // Create a mock thread and comments in the database
        const threadId = 'thread-stringThreadId';
        const mockThreadPayload = {
          id: threadId,
          title: 'stringThreadTitle',
          body: 'stringThreadBody',
          owner: 'user-stringUserId1',
        };
        const mockCommentsPayload = [
          {
            id: 'comment-stringCommentId1',
            content: 'stringCommentContent1',
            owner: 'user-stringUserId1',
          },
          {
            id: 'comment-stringCommentId2',
            content: 'stringCommentContent2',
            owner: 'user-stringUserId2',
          },
        ];
        const mockUserPayload = [
          {
            id: 'user-stringUserId1',
            username: 'stringUsername1',
          },
          {
            id: 'user-stringUserId2',
            username: 'stringUsername2',
          },
        ];

        // Add user to database
        await UsersTableTestHelper.addUser(mockUserPayload[0]);
        await UsersTableTestHelper.addUser(mockUserPayload[1]);

        // Add thread to database
        await ThreadsTableTestHelper.addThread(mockThreadPayload);

        // Add comment to database
        await CommentsTableTestHelper.addComment({
          thread: threadId,
          ...mockCommentsPayload[0],
        });
        await CommentsTableTestHelper.addComment({
          thread: threadId,
          ...mockCommentsPayload[1],
        });

        const server = await createServer(container);

        // Delete one of the comment
        await CommentsTableTestHelper.deleteComment(mockCommentsPayload[1].id);

        // Action
        const response = await server.inject({
          method: 'GET',
          url: `/threads/${threadId}`,
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
        expect(responseJson.data).toBeDefined();

        // Assert thread properties
        const { thread } = responseJson.data;
        expect(thread).toBeDefined();
        expect(thread.id).toEqual(mockThreadPayload.id);
        expect(thread.title).toEqual(mockThreadPayload.title);
        expect(thread.body).toEqual(mockThreadPayload.body);
        expect(thread.username).toEqual(mockUserPayload[0].username);
        expect(thread.date).toBeDefined();

        // Assert comments
        expect(thread.comments).toBeDefined();
        expect(thread.comments.length).toEqual(mockCommentsPayload.length);
        for (let i = 0; i < mockCommentsPayload.length; i++) {
          const mockCommentPayload = mockCommentsPayload[i];
          const comment = thread.comments[i];
          expect(comment.id).toEqual(mockCommentPayload.id);
          expect(comment.content).toEqual(
            i === 1 ? '**komentar telah dihapus**' : mockCommentPayload.content,
          );
          expect(comment.username).toEqual(mockUserPayload[i].username);
          expect(comment.date).toBeDefined();
        }
      });
    });
  });
});
