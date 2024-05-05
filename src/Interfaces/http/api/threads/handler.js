const PostThreadUseCase = require('../../../../Applications/use_case/PostThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { payload } = request;
    const { id: userId } = request.auth.credentials;
    const useCasePayload = {
      title: payload.title,
      body: payload.body,
      owner: userId,
    };

    const postThreadUseCase = this._container.getInstance(
      PostThreadUseCase.name,
    );
    const postedThread = await postThreadUseCase.execute(useCasePayload);
    const response = h.response({
      status: 'success',
      message: 'Thread posted successfully',
      data: {
        addedThread: postedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const useCasePayload = {
      thread: threadId,
    };

    const getThreadByIdUseCase = this._container.getInstance(
      GetThreadByIdUseCase.name,
    );

    const getThread = await getThreadByIdUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: getThread,
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
