const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetComment = require('../../../Domains/comments/entities/GetComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('PostCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'stringThreadId',
    };

    const mockGetThread = new GetThread({
      id: 'stringThreadId',
      title: 'stringThreadTitle',
      body: 'stringThreadBody',
      username: 'stringThreadUsername',
      date: '2024-04-25T12:00:00Z',
    });

    const mockGetComment = new GetComment([
      {
        id: 'stringCommentId1',
        content: 'stringCommentContent1',
        username: 'stringCommentUsername1',
        date: '2024-04-25T12:00:00Z', // ISO format string
        thread: 'stringThreadId',
        deleted: true,
      },
      {
        id: 'stringCommentId2',
        content: 'stringCommentContent2',
        username: 'stringCommentUsername2',
        date: '2024-04-26T12:00:00Z', // ISO format string
        thread: 'stringThreadId',
        deleted: false,
      },
    ]);

    // Mock ThreadRepository
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(mockGetThread);

    // Mock CommentRepository
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentByThreadId = jest
      .fn()
      .mockResolvedValue(mockGetComment);

    // Action
    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await getThreadByIdUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.thread,
    );
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(
      useCasePayload.thread,
    );
    expect(mockCommentRepository.getCommentByThreadId).toHaveBeenCalledWith(
      useCasePayload.thread,
    );
    expect(result).toEqual({
      thread: {
        id: 'stringThreadId',
        title: 'stringThreadTitle',
        body: 'stringThreadBody',
        username: 'stringThreadUsername',
        date: '2024-04-25T12:00:00Z',
        comments: [
          {
            id: 'stringCommentId1',
            content: '**komentar telah dihapus**',
            username: 'stringCommentUsername1',
            date: '2024-04-25T12:00:00Z', // ISO format string
          },
          {
            id: 'stringCommentId2',
            content: 'stringCommentContent2',
            username: 'stringCommentUsername2',
            date: '2024-04-26T12:00:00Z', // ISO format string
          },
        ],
      },
    });
  });
});
