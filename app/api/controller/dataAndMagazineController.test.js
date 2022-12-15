const { getMagazineOrBookByISBN } = require('./dataAndMagazineController');

const mockRequest = (isbnValue) => {
  return {
    query: { isbn: isbnValue },
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.data = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

test('get Magazine or Book By using its IBSN number where status should be 200', async () => {
  const isbn = '2365-5632-7854';
  const req = mockRequest(isbn);
  const res = mockResponse();
  await getMagazineOrBookByISBN(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
});

test('get Magazine or Book By using its IBSN number where status should be 409', async () => {
  const isbn = '2365-563332-7854';
  const req = mockRequest(isbn);
  const res = mockResponse();
  await getMagazineOrBookByISBN(req, res);
  expect(res.status).toHaveBeenCalledWith(409);
});
