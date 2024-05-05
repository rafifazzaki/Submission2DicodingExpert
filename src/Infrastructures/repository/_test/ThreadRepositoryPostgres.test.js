const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postUser function', () => {
    it('should persist post thread and return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'stringOwnerId',
        username: 'stringUsername',
        password: 'stringPassword',
        fullname: 'stringFullname',
      }); // Add the user first

      const postThread = new PostThread({
        title: 'stringTitle',
        body: 'stringBody',
        owner: 'stringOwnerId',
      });

      const fakeIdGenerator = () => 'stringThreaId'; // stub;
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await threadRepository.postThread(postThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById(
        'thread-stringThreaId',
      ); // Id Generator start with thread-
      expect(threads).toHaveLength(1);
    });

    it('should return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'stringOwnerId',
        username: 'stringUsername',
        password: 'stringPassword',
        fullname: 'stringFullname',
      }); // Add the user first

      const postThread = new PostThread({
        title: 'stringTitle',
        body: 'stringBody',
        owner: 'stringOwnerId',
      });

      const fakeIdGenerator = () => 'stringThreaId'; // stub;
      const threadRepository = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const postedThread = await threadRepository.postThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(
        new PostedThread({
          id: 'thread-stringThreaId', // Id Generator start with thread-
          title: 'stringTitle',
          owner: 'stringOwnerId',
        }),
      );
    });
  });
  describe('verifyThreadAvailability Function', () => {
    it('should resolve and throw error when not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreaId',
        owner: 'user-stringUserId',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-'),
      ).rejects.toThrowError(NotFoundError);

      

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability(
          'thread-stringThreaId',
        ),
      ).resolves.not.toThrow(NotFoundError);;
    });
  });

  describe('getThreadById', () => {
    it('should return the thread by ID if found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-stringUserId',
        username: 'stringUsername',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-stringThreadId',
        title: 'stringTitle',
        body: 'stringBody',
        owner: 'user-stringUserId',
      });

      const threadRepository = new ThreadRepositoryPostgres(pool);

      // Action
      const thread = await threadRepository.getThreadById(
        'thread-stringThreadId',
      );

      // Assert
      expect(thread.id).toEqual('thread-stringThreadId');
      expect(thread.title).toEqual('stringTitle');
      expect(thread.body).toEqual('stringBody');
      expect(thread.username).toEqual('stringUsername');
    });

    // it('should throw NotFoundError if thread not found', async () => {
    //   // Arrange
    //   const threadRepository = new ThreadRepositoryPostgres(pool);

    //   // Action and Assert
    //   await expect(
    //     threadRepository.getThreadById('non-existent-id'),
    //   ).rejects.toThrowError(NotFoundError);
    // });
  });
});
