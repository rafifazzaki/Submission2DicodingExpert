const PostThread = require('../PostThread');

describe('PostThread', () => {
  it('should create a PostThread object with valid payload', () => {
    // Arrange
    const payload = {
      title: 'stringTitle',
      body: 'stringBody',
      owner: 'stringOwnerId',
    };

    // Action
    const postThread = new PostThread(payload);

    // Assert
    expect(postThread.title).toEqual(payload.title);
    expect(postThread.body).toEqual(payload.body);
    expect(postThread.owner).toEqual(payload.owner);
  });

  it('should throw an error when payload is missing a needed property', () => {
    // Arrange
    const payload = {
      // Missing title property
      body: 'stringBody',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError(
      'POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw an error when payload properties are not of expected type', () => {
    // Arrange
    const payload = {
      title: 1234, // Incorrect type
      body: 'stringBody',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError(
      'POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
