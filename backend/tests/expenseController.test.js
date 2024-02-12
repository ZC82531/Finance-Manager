jest.mock('../db/expenseModel', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../db/userModel', () => ({
  findById: jest.fn(),
}));

const expenseModel = require('../db/expenseModel');
const userModel = require('../db/userModel');
const {
  createExpense,
  deleteExpense,
  getAllExpenses,
} = require('../controller/expenseController');

const mockRes = () => {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  return res;
};
const mockReq = (body) => ({ body });

beforeEach(() => jest.clearAllMocks());

// ---------------------------------------------------------------------------
describe('createExpense', () => {
  test('returns 401 error when amount is missing', async () => {
    const req = mockReq({ category: 'food', date: '2026-04-01', usersid: 'u1' });
    const res = mockRes();
    await createExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when category is missing', async () => {
    const req = mockReq({ amount: 50, date: '2026-04-01', usersid: 'u1' });
    const res = mockRes();
    await createExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when date is missing', async () => {
    const req = mockReq({ amount: 50, category: 'food', usersid: 'u1' });
    const res = mockRes();
    await createExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when usersid is missing', async () => {
    const req = mockReq({ amount: 50, category: 'food', date: '2026-04-01' });
    const res = mockRes();
    await createExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 200 success and calls create with the request body', async () => {
    const fakeExpense = { _id: 'exp1', save: jest.fn() };
    const fakeUser = { expense_id: [], save: jest.fn() };

    expenseModel.create.mockResolvedValue(fakeExpense);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeUser),
    });

    const body = { amount: 50, category: 'food', date: '2026-04-01', usersid: 'u1' };
    const req = mockReq(body);
    const res = mockRes();
    await createExpense(req, res);

    expect(expenseModel.create).toHaveBeenCalledWith(body);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 200, message: fakeExpense }),
    );
  });

  test('pushes new expense id onto the user expense list', async () => {
    const fakeExpense = { _id: 'exp99', save: jest.fn() };
    const fakeUser = { expense_id: [], save: jest.fn() };

    expenseModel.create.mockResolvedValue(fakeExpense);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeUser),
    });

    const req = mockReq({ amount: 10, category: 'misc', date: '2026-04-01', usersid: 'u1' });
    const res = mockRes();
    await createExpense(req, res);

    expect(fakeUser.expense_id).toContain('exp99');
  });
});

// ---------------------------------------------------------------------------
describe('deleteExpense', () => {
  test('returns 401 error when expense is not found', async () => {
    expenseModel.findById.mockResolvedValue(null);
    userModel.findById.mockResolvedValue({ _id: 'u1' });

    const req = mockReq({ expenseId: 'exp1', userId: 'u1' });
    const res = mockRes();
    await deleteExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 401 error when user is not found', async () => {
    expenseModel.findById.mockResolvedValue({ _id: 'exp1' });
    userModel.findById.mockResolvedValue(null);

    const req = mockReq({ expenseId: 'exp1', userId: 'u1' });
    const res = mockRes();
    await deleteExpense(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', statusCode: 401 }),
    );
  });

  test('returns 201 success after deleting expense', async () => {
    const fakeExpense = { _id: 'exp1' };
    const fakeUser = { expense_id: ['exp1'], save: jest.fn() };

    expenseModel.findById.mockResolvedValue(fakeExpense);
    userModel.findById.mockResolvedValue(fakeUser);
    expenseModel.findByIdAndDelete.mockResolvedValue(fakeExpense);

    const req = mockReq({ expenseId: 'exp1', userId: 'u1' });
    const res = mockRes();
    await deleteExpense(req, res);

    expect(expenseModel.findByIdAndDelete).toHaveBeenCalledWith('exp1');
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 201 }),
    );
  });

  test('removes the expenseId from the user expense list', async () => {
    const fakeExpense = { _id: 'exp1' };
    const fakeUser = { expense_id: ['exp1', 'exp2'], save: jest.fn() };

    expenseModel.findById.mockResolvedValue(fakeExpense);
    userModel.findById.mockResolvedValue(fakeUser);
    expenseModel.findByIdAndDelete.mockResolvedValue(fakeExpense);

    const req = mockReq({ expenseId: 'exp1', userId: 'u1' });
    const res = mockRes();
    await deleteExpense(req, res);

    expect(fakeUser.expense_id).not.toContain('exp1');
    expect(fakeUser.expense_id).toContain('exp2');
  });
});

// ---------------------------------------------------------------------------
describe('getAllExpenses', () => {
  test('returns 200 success with the user expenses', async () => {
    const expenses = [
      { _id: 'e1', date: '2026-04-15' },
      { _id: 'e2', date: '2026-03-01' },
    ];
    const fakeUser = { expense_id: expenses };

    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeUser),
    });

    const req = mockReq({ userId: 'u1' });
    const res = mockRes();
    await getAllExpenses(req, res);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success', statusCode: 200 }),
    );
  });

  test('calls findById with the correct userId', async () => {
    const fakeUser = { expense_id: [] };
    const populateMock = jest.fn().mockResolvedValue(fakeUser);
    userModel.findById.mockReturnValue({ populate: populateMock });

    const req = mockReq({ userId: 'user42' });
    const res = mockRes();
    await getAllExpenses(req, res);

    expect(userModel.findById).toHaveBeenCalledWith('user42');
  });

  test('returns error response when model throws', async () => {
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('DB down')),
    });

    const req = mockReq({ userId: 'u1' });
    const res = mockRes();
    await getAllExpenses(req, res);

    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error' }),
    );
  });
});
