const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
  it('should create PostedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'stringThreadId',
      title: 'stringTitle',
      owner: 'stringOwnerId',
    };

    // Action
    const { id, title, owner } = new PostedThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      // Missing date property
      title: 'stringTitle',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError(
      'POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload properties are not of expected type', () => {
    // Arrange
    const payload = {
      id: 123, // Wrong data type
      title: 'stringTitle',
      owner: 'stringOwnerId',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError(
      'POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
