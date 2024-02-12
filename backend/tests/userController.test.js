jest.mock('../db/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const userModel = require('../db/userModel');
const {
  loginController,
  signupContorller,
  logoutController,
} = require('../controller/userController');

// Helper factories
const mockRes = () => {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
const mockReq = (body) => ({ body });

beforeEach(() => jest.clearAllMocks());

// ---------------------------------------------------------------------------
describe('loginController', () => {
  test('returns 400 error when email is missing', async () => {
    const req = mockReq({ password: 'secret' });
    const res = mockRes();
    await loginController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 400 }),
    );
  });

  test('returns 400 error when password is missing', async () => {
    const req = mockReq({ email: 'alice@example.com' });
    const res = mockRes();
    await loginController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 400 }),
    );
  });

  test('returns 401 error when user not found in database', async () => {
    userModel.findOne.mockResolvedValue(null);
    const req = mockReq({ email: 'alice@example.com', password: 'wrong' });
    const res = mockRes();
    await loginController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 201 success with user object when credentials are valid', async () => {
    const fakeUser = { _id: 'u1', username: 'Alice', email: 'alice@example.com' };
    userModel.findOne.mockResolvedValue(fakeUser);
    const req = mockReq({ email: 'alice@example.com', password: 'correct' });
    const res = mockRes();
    await loginController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 201, message: fakeUser }),
    );
  });

  test('returns error response when model throws', async () => {
    userModel.findOne.mockRejectedValue(new Error('db timeout'));
    const req = mockReq({ email: 'alice@example.com', password: 'pass' });
    const res = mockRes();
    await loginController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' }),
    );
  });
});

// ---------------------------------------------------------------------------
describe('signupContorller', () => {
  test('returns 401 error when username is missing', async () => {
    const req = mockReq({ email: 'a@b.com', password: 'pass' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when email is missing', async () => {
    const req = mockReq({ username: 'Alice', password: 'pass' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when password is missing', async () => {
    const req = mockReq({ username: 'Alice', email: 'a@b.com' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 201 success when all fields are provided', async () => {
    userModel.create.mockResolvedValue({ _id: 'u1' });
    const req = mockReq({ username: 'Alice', email: 'a@b.com', password: 'pass' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 201 }),
    );
  });

  test('calls userModel.create with the correct fields', async () => {
    userModel.create.mockResolvedValue({ _id: 'u2' });
    const req = mockReq({ username: 'Bob', email: 'bob@b.com', password: 'pw' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(userModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ username: 'Bob', email: 'bob@b.com', password: 'pw' }),
    );
  });

  test('returns error when model throws (e.g., duplicate email)', async () => {
    userModel.create.mockRejectedValue(new Error('duplicate key'));
    const req = mockReq({ username: 'Alice', email: 'a@b.com', password: 'pass' });
    const res = mockRes();
    await signupContorller(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' }),
    );
  });
});

// ---------------------------------------------------------------------------
describe('logoutController', () => {
  test('returns 200 success when session is destroyed', async () => {
    const req = { session: { destroy: jest.fn((cb) => cb(null)) } };
    const res = mockRes();
    await logoutController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 200 }),
    );
  });

  test('returns 500 error when session destroy fails', async () => {
    const req = {
      session: { destroy: jest.fn((cb) => cb(new Error('session store error'))) },
    };
    const res = mockRes();
    await logoutController(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 500 }),
    );
  });
});
