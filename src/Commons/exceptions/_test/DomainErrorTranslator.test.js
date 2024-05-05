const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat mengambil thread karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat mengambil thread karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat mengambil komentar karena properti yang dibutuhkan tidak ada',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat mengambil komentar karena tipe data tidak sesuai',
      ),
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('GET_COMMENT.NOT_AN_ARRAY_DATA_TYPE'),
      ),
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat mengambil komentar karena data yang diterima bukanlah array',
      ),
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
