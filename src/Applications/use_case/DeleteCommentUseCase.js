class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, thread, owner } = useCasePayload;
    await this._commentRepository.verifyCommentAvailability(id, thread);
    await this._commentRepository.verifyCommentOwner(id, owner);
    await this._commentRepository.deleteCommentById(id);
  }
}

module.exports = DeleteCommentUseCase;
