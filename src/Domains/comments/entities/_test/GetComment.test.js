const GetComment = require('../GetComment');

describe('GetComment', () => {
  describe('Single Comment', () => {
    it('should create a GetComment object with valid payload for a single comment', () => {
      // Arrange
      const payload = [
        {
          id: 'stringId',
          content: 'stringContent',
          username: 'username',
          date: '2024-04-25T12:00:00Z', // ISO format string
          thread: 'stringThreadId',
        },
      ];

      // Action
      const getComment = new GetComment(payload);

      // Assert
      expect(Array.isArray(getComment.comments)).toBe(true);
      expect(getComment.comments.length).toBe(1);

      const comment = getComment.comments[0];
      expect(comment.id).toEqual(payload[0].id);
      expect(comment.content).toEqual(payload[0].content);
      expect(comment.username).toEqual(payload[0].username);
      expect(comment.date).toEqual(payload[0].date);
      expect(comment.thread).toEqual(payload[0].thread);
    });

    it('should throw an error when payload is not an array', () => {
      // Arrange
      const payload = {
        id: 'stringId',
        content: 'stringContent',
        username: 'stringUsername',
        date: '2024-04-25T12:00:00Z', // ISO format string
        thread: 'stringThreadId',
      };

      // Action and Assert
      expect(() => new GetComment(payload)).toThrowError(
        'GET_COMMENT.NOT_AN_ARRAY_DATA_TYPE',
      );
    });

    it('should throw an error when payload properties are not of expected type', () => {
      // Arrange
      const payload = [
        {
          id: 'stringId',
          content: 1234, // Incorrect type
          username: 'stringUsername',
          date: '2024-04-25T12:00:00Z', // ISO format string
          thread: 'stringThreadId',
        },
      ];

      // Action and Assert
      expect(() => new GetComment(payload)).toThrowError(
        'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    });

    it('should throw an error when payload is missing a needed property', () => {
      // Arrange
      const payload = [
        {
          // Missing content property
          id: 'stringId',
          username: 'stringUsername',
          date: '2024-04-25T12:00:00Z', // ISO format string
          thread: 'stringThreadId',
        },
      ];

      // Action and Assert
      expect(() => new GetComment(payload)).toThrowError(
        'GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
      );
    });
  });

  describe('Multiple Comments', () => {
    it('should create a GetComment object with valid payload for multiple comments', () => {
      // Arrange
      const payload = [
        {
          id: 'stringId1',
          content: 'stringContent1',
          username: 'stringUsername1',
          date: '2024-04-25T12:00:00Z', // ISO format string
          thread: 'stringThreadId1',
        },
        {
          id: 'stringId2',
          content: 'stringContent2',
          username: 'stringUsername2',
          date: '2024-04-26T12:00:00Z', // ISO format string
          thread: 'stringThreadId2',
        },
      ];

      // Action
      const getComment = new GetComment(payload);

      // Assert
      expect(Array.isArray(getComment.comments)).toBe(true);
      expect(getComment.comments.length).toBe(2);

      const comment1 = getComment.comments[0];
      expect(comment1.id).toEqual(payload[0].id);
      expect(comment1.content).toEqual(payload[0].content);
      expect(comment1.username).toEqual(payload[0].username);
      expect(comment1.date).toEqual(payload[0].date);
      expect(comment1.thread).toEqual(payload[0].thread);

      const comment2 = getComment.comments[1];
      expect(comment2.id).toEqual(payload[1].id);
      expect(comment2.content).toEqual(payload[1].content);
      expect(comment2.username).toEqual(payload[1].username);
      expect(comment2.date).toEqual(payload[1].date);
      expect(comment2.thread).toEqual(payload[1].thread);
    });
  });
  describe('Soft Deleted Comment', () => {
    it('should remap the comment content to "**komentar telah dihapus**" when "deleted" property is true', () => {
      // Arrange
      const payload = [
        {
          id: 'stringId',
          content: 'stringContent',
          username: 'username',
          date: '2024-04-25T12:00:00Z',
          thread: 'stringThreadId',
          deleted: true, // Set deleted property to true
        },
      ];

      // Action
      const getComment = new GetComment(payload);

      // Assert
      expect(Array.isArray(getComment.comments)).toBe(true);
      expect(getComment.comments.length).toBe(1);

      const comment = getComment.comments[0];
      expect(comment.id).toEqual(payload[0].id);
      expect(comment.content).toEqual('**komentar telah dihapus**'); // Expect content to be soft-deleted message
      expect(comment.username).toEqual(payload[0].username);
      expect(comment.date).toEqual(payload[0].date);
      expect(comment.thread).toEqual(payload[0].thread);
    });
  });
});
