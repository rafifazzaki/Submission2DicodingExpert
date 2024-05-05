const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostCommentUseCase = require('../PostCommentUseCase');

describe('PostCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'stringContent',
      thread: 'stringThreadId',
      owner: 'stringOwnerId',
    };

    const mockPostedComment = new PostedComment({
      id: 'stringCommentId',
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      owner: useCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.postComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockPostedComment));

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const postCommentUseCase = new PostCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedComment = await postCommentUseCase.execute(useCasePayload);

    // Assert
    expect(postedComment).toStrictEqual(
      new PostedComment({
        id: 'stringCommentId',
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      }),
    );
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        content: useCasePayload.content,
        thread: useCasePayload.thread,
        owner: useCasePayload.owner,
      }),
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('stringThreadId');

  });
});
