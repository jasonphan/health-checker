const app = require('../server');
const { getHeaders } = require('../utils/curl');

let server;

const PORT = process.env.TEST_SERVER_PORT;
const url = `http://localhost:${PORT}`;

beforeAll(() => {
  server = app.listen(PORT);
});

afterAll(() => {
  server.close();
});

describe('Status endpoints', () => {
  it('should return status 200', async () => {
    const res = await getHeaders(`${url}/status/200`);

    expect(res.status).toEqual('200');
  });

  it('should return status 404', async () => {
    const res = await getHeaders(`${url}/status/404`);

    expect(res.status).toEqual('404');
  });
});

describe('Redirect endpoint', () => {
  it('should return status 301 not following redirects', async () => {
    const res = await getHeaders(`${url}/status/301`, { followRedirects: false });

    expect(res.status).toEqual('301');
  });

  it('should return status 200 following redirects', async () => {
    const res = await getHeaders(`${url}/status/301`, { followRedirects: true });

    expect(res.status).toEqual('200');
  });
});

describe('Basic authentication', () => {
  it('should return status 401 with no creds', async () => {
    const res = await getHeaders(`${url}/auth`);

    expect(res.status).toEqual('401');
  });

  it('should return status 401 with bad creds', async () => {
    const res = await getHeaders(`${url}/auth`, {
      basicAuth: {
        username: 'bad_user',
        password: 'bad_password',
      },
    });

    expect(res.status).toEqual('401');
  });

  it('should return status 200', async () => {
    const res = await getHeaders(`${url}/auth`, {
      basicAuth: {
        username: 'user',
        password: 'password',
      },
    });

    expect(res.status).toEqual('200');
  });
});

describe('Timeouts', () => {
  it('should timeout after 0.1s', async () => {
    await expect(getHeaders(`${url}/timeout`, { maxTime: 0.1 }))
      .rejects
      .toThrow(/^curl: \(28\) Operation timed out/);
  });

  it('should return 200 after 1s', async () => {
    const res = await getHeaders(`${url}/timeout`, { maxTime: 1 });

    expect(res.status).toEqual('200');
  });
});
