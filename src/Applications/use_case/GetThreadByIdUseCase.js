class GetThreadById {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;

    await this._threadRepository.verifyThreadAvailability(thread);

    // Retrieve thread and comments
    const threadResult = await this._threadRepository.getThreadById(thread);
    const commentsResult =
      await this._commentRepository.getCommentByThreadId(thread);

    // Extract relevant properties from threadResult
    const remappedThread = {
      thread: {
        id: threadResult.id,
        title: threadResult.title,
        body: threadResult.body,
        username: threadResult.username,
        date: threadResult.date,
        comments: commentsResult.comments.map((comment) => ({
          id: comment.id,
          content: comment.content,
          username: comment.username,
          date: comment.date,
        })),
      },
    };

    return remappedThread;
  }
}

module.exports = GetThreadById;
