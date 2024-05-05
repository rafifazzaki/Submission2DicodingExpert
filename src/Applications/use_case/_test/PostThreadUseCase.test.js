const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostThreadUseCase = require('../PostThreadUseCase');

describe('PostThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'stringTitle',
      body: 'stringBody',
      owner: 'stringOwnerId',
    };

    const mockPostedThread = new PostedThread({
      id: 'stringThreadId',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.postThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    const postThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await postThreadUseCase.execute(useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(
      new PostedThread({
        id: 'stringThreadId',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      }),
    );
    expect(mockThreadRepository.postThread).toBeCalledWith(
      new PostThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
