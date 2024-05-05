const PostedComment = require('../PostedComment');

describe('PostedComment', () => {
  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'stringCommentId',
      content: 'stringContent',
      owner: 'stringOwnerId',
    };

    // Action
    const { id, content, owner } = new PostedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      // Missing content property
      id: 'stringCommentId',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError(
      'POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload properties are not of expected type', () => {
    // Arrange
    const payload = {
      id: 'stringCommentId',
      content: 123, // Wrong data type
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError(
      'POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
