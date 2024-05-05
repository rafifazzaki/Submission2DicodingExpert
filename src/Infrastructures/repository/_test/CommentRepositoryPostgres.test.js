const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');


describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postComment function', () => {
    it('should persist post comment and return posted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'stringOwnerId',
        username: 'stringUsername',
        password: 'stringPassword',
        fullname: 'stringFullname',
      }); // Add the user first

      await ThreadsTableTestHelper.addThread({
        id: 'stringThreadId',
        title: 'stringTitle',
        body: 'stringBody',
        owner: 'stringOwnerId',
      }); // Add the thread to comments on

      const postComment = new PostComment({
        content: 'stringContent',
        thread: 'stringThreadId',
        owner: 'stringOwnerId',
      });

      const fakeIdGenerator = () => 'stringCommentId'; // stub;
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepository.postComment(postComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-stringCommentId',
      ); // Id Generator start with comment-
      expect(comments).toHaveLength(1);
    });

    it('should return posted comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'stringOwnerId',
        username: 'stringUsername',
        password: 'stringPassword',
        fullname: 'stringFullname',
      }); // Add the user first

      await ThreadsTableTestHelper.addThread({
        id: 'stringThreadId',
        title: 'stringTitle',
        body: 'stringBody',
        owner: 'stringOwnerId',
      }); // Add the thread to comments on

      const postComment = new PostComment({
        content: 'stringContent',
        thread: 'stringThreadId',
        owner: 'stringOwnerId',
      });

      const fakeIdGenerator = () => 'stringCommentId'; // stub;
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const postedComment = await commentRepository.postComment(postComment);

      // Assert
      expect(postedComment).toStrictEqual(
        new PostedComment({
          id: 'comment-stringCommentId', // Id Generator start with comment-
          content: 'stringContent',
          owner: 'stringOwnerId',
        }),
      );
    });
  });

  describe('verivyCommentAvailability', () => {
    it('should throw error when comment is not found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      }); // Thread User
      await UsersTableTestHelper.addUser({
        id: 'user-stringCommentUserId',
        username: 'stringCommentUsername',
      }); // Comment User
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId',
        thread: 'thread-stringThreadId',
        owner: 'user-stringCommentUserId',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action
      const failedResult = commentRepositoryPostgres.verifyCommentAvailability(
        'comment-',
        'thread-stringThreadId',
      );

      // Assert
      await expect(failedResult).rejects.toThrow(NotFoundError);
      
    });

    it('should resolve when comment is found', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      }); // Thread User
      await UsersTableTestHelper.addUser({
        id: 'user-stringCommentUserId',
        username: 'stringCommentUsername',
      }); // Comment User
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId',
        thread: 'thread-stringThreadId',
        owner: 'user-stringCommentUserId',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action
      const successResult = commentRepositoryPostgres.verifyCommentAvailability(
        'comment-stringCommentId',
        'thread-stringThreadId',
      );
      
      // Assert
      await expect(successResult).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should resolve when comment owner matches', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId',
        thread: 'thread-stringThreadId',
        owner: 'user-stringUserId', // Comment owned by user
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = commentRepositoryPostgres.verifyCommentOwner(
        'comment-stringCommentId',
        'user-stringUserId', // Same owner as in the comment
      )

      // Assert
      await expect(result).resolves.not.toThrowError(AuthorizationError);
    });

    it('should reject when comment owner does not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId',
        thread: 'thread-stringThreadId',
        owner: 'user-stringUserId', // Comment owned by user
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = commentRepositoryPostgres.verifyCommentOwner(
        'comment-stringCommentId',
        'different-user-id', // Different owner than in the comment
      );
      // Assert
      await expect(result).rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById', () => {
    it('should delete the comment by ID', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId',
        thread: 'thread-stringThreadId',
        owner: 'user-stringUserId', // Comment owned by user
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(
        'comment-stringCommentId',
      );

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-stringCommentId',
      );
      expect(comments[0].deleted).toEqual(true); // Comment should be deleted
    });

    // it('should not throw error if comment does not exist', async () => {
    //   // Arrange
    //   const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

    //   // Action
    //   const result = commentRepositoryPostgres.deleteCommentById('non-existing-comment-id');

    //   // Assert
    //   await expect(result).rejects.toThrow(NotFoundError);
    // });
  });

  describe('getCommentByThreadId', () => {
    it('should return an array of comments by thread ID', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId1',
        thread: 'thread-stringThreadId',
        owner: 'user-stringUserId', // Comment owned by user
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-stringCommentId2',
        thread: 'thread-stringThreadId',
        owner: 'user-stringUserId', // Comment owned by user
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        'thread-stringThreadId',
      );

      // Assert
      expect(comments.comments).toHaveLength(2);
      const comment1 = comments.comments[0];
      const comment2 = comments.comments[1];
      // Assert comment1
      expect(comment1.id).toEqual('comment-stringCommentId1');
      expect(comment1.thread).toEqual('thread-stringThreadId');
      expect(comment1.content).toEqual('stringContent');
      expect(comment1.username).toEqual('stringUsername');
      // Assert comment2
      expect(comment2.id).toEqual('comment-stringCommentId2');
      expect(comment2.thread).toEqual('thread-stringThreadId');
      expect(comment2.content).toEqual('stringContent');
      expect(comment2.username).toEqual('stringUsername');
    });

    it('should return an empty array if no comments found for the thread ID', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        owner: 'user-stringUserId',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        'thread-stringThreadId',
      );

      // Assert
      expect(comments.comments).toHaveLength(0);
    });
  });
});
