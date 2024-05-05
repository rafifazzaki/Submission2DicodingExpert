const PostComment = require('../PostComment');

describe('PostComment', () => {
  it('should create a PostComment object with valid payload', () => {
    // Arrange
    const payload = {
      content: 'stringContent',
      thread: 'stringThreadId',
      owner: 'stringOwnerId',
    };

    // Action
    const postComment = new PostComment(payload);

    // Assert
    expect(postComment.content).toEqual(payload.content);
    expect(postComment.thread).toEqual(payload.thread);
    expect(postComment.owner).toEqual(payload.owner);
  });

  it('should throw an error when payload is missing a needed property', () => {
    // Arrange
    const payload = {
      // Missing content property
      owner: 'stringOwnerId',
      thread: 'stringThreadId',
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError(
      'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw an error when payload properties are not of expected type', () => {
    // Arrange
    const payload = {
      content: 1234, // Incorrect type
      thread: 'stringThreadId',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostComment(payload)).toThrowError(
      'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
