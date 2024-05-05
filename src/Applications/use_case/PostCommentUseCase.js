const PostComment = require('../../Domains/comments/entities/PostComment');

class PostCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    await this._threadRepository.verifyThreadAvailability(thread);
    const postCommentEntity = new PostComment(useCasePayload);
    return this._commentRepository.postComment(postCommentEntity);
  }
}

module.exports = PostCommentUseCase;
