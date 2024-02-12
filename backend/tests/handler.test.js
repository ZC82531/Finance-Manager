const { success, error } = require('../utils/handler');

describe('success()', () => {
  test('returns an object with status "success"', () => {
    const result = success(200, 'OK');
    expect(result.status).toBe('success');
  });

  test('echoes the given status code', () => {
    expect(success(201, 'created').statusCode).toBe(201);
    expect(success(200, 'ok').statusCode).toBe(200);
  });

  test('echoes the given message body', () => {
    const body = { id: 1, name: 'Alice' };
    expect(success(200, body).message).toBe(body);
  });

  test('message can be a string', () => {
    expect(success(200, 'user created').message).toBe('user created');
  });

  test('message can be an array', () => {
    const arr = [1, 2, 3];
    expect(success(200, arr).message).toEqual(arr);
  });
});

describe('error()', () => {
  test('returns an object with status "error"', () => {
    const result = error(401, 'Unauthorized');
    expect(result.status).toBe('error');
  });

  test('echoes the given error code', () => {
    expect(error(400, 'Bad Request').statusCode).toBe(400);
    expect(error(500, 'Server Error').statusCode).toBe(500);
  });

  test('echoes the given error message', () => {
    expect(error(401, 'Unauthorized').message).toBe('Unauthorized');
  });

  test('success and error return distinct status strings', () => {
    expect(success(200, '').status).not.toBe(error(400, '').status);
  });
});
