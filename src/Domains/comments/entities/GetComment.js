class GetComment {
  constructor(payload) {
    if (!Array.isArray(payload)) {
      throw new Error('GET_COMMENT.NOT_AN_ARRAY_DATA_TYPE');
    }

    this.comments = payload.map((comment) => this._remapComment(comment));
  }

  _remapComment(comment) {
    // Verify payload after remapping
    this._verifyPayload(comment);
    const { id, username, date, deleted, thread, content } = comment;

    // Soft Deleted feature
    const remappedContent = deleted ? '**komentar telah dihapus**' : content;

    const remappedComment = {
      id,
      username,
      date,
      thread,
      content: remappedContent,
    };

    return remappedComment;
  }

  _verifyPayload({ id, content, username, date }) {
    if (!id || !content || !username || !date) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
