const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const PostCommentUseCase = require('../../../../Applications/use_case/PostCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { payload } = request;
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;

    const useCasePayload = {
      content: payload.content,
      thread: threadId,
      owner: userId,
    };

    const postCommentUseCase = this._container.getInstance(
      PostCommentUseCase.name,
    );
    const postedComment = await postCommentUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      message: 'Comment posted successfully',
      data: {
        addedComment: postedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const useCasePayload = {
      id: commentId,
      thread: threadId,
      owner: userId,
    };

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );

    await deleteCommentUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      message: 'Comment deleted successfully',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
