const GetThread = require('../GetThread');

describe('GetThread', () => {
  it('should create a GetThread object with valid payload', () => {
    // Arrange
    const payload = {
      id: 'stringId',
      title: 'stringTitle',
      body: 'stringBody',
      username: 'stringUsername',
      date: '2024-04-25T12:00:00Z', // ISO format string
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.date).toEqual(payload.date);
  });

  it('should throw an error when payload is missing a needed property', () => {
    // Arrange
    const payload = {
      // Missing id property
      title: 'stringTitle',
      body: 'stringBody',
      username: 'stringUsername',
      date: '2024-04-25T12:00:00Z', // ISO format string
    }; // Pass date as a Date object    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw an error when payload properties are not of expected type', () => {
    // Arrange
    const payload = {
      id: 1234, // Incorrect type
      title: 'stringTitle',
      body: 'stringBody',
      username: 'stringUsername',
      date: '2024-04-25T12:00:00Z', // ISO format string
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
