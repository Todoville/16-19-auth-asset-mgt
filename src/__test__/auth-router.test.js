import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise, removeAccountMockPromise } from './lib/account-mock';

// jest.setTimeout(20000);
const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('AUTH router', () => {
  beforeAll(startServer);
  afterEach(removeAccountMockPromise);
  // afterAll(stopServer);

  test('POST 400 to /api/signup for unsuccessful account creation, no token for u', () => {
    const badSignupMock = {
      username: '',
      email: faker.internet.email(),
      password: 'lol',
    };
    return superagent.post(`${apiUrl}/signup`)
      .send(badSignupMock)
      .then((response) => {
        expect(response.status).toEqual(400);
        expect(response.body.token).toBeFalsy();
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});

test('POST 409 to /api/signup for duplicate email/username', () => {
  return createAccountMockPromise()
    .then((mockData) => {
      return superagent.post(`${apiUrl}/signup`)
        .send({ username: mockData.account.username, email: mockData.account.email, password: 'asdfklasjd' });
    })
    .then((dupeData) => { 
      return superagent.post(`${apiUrl}/signup`)
        .send({ username: dupeData.account.username, email: dupeData.account.email, password: dupeData.account.password });
    })
    .catch((err) => {
      expect(err.status).toEqual(409);
    });
});

test('POST 200 to /api/signup for successful account creation and receipt of a TOKEN', () => {
  const mockAccount = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'lol',
  };
  return superagent.post(`${apiUrl}/signup`)
    .send(mockAccount)
    .then((response) => {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    })
    .catch((err) => {
      throw err;
    });
});

test('GET 200 to /api/login for successful login and receipt of a token', () => {
  return createAccountMockPromise()
    .then((mockData) => {
      return superagent.get(`${apiUrl}/login`)
        .auth(mockData.account.username, mockData.originalRequest.password);
    })
    .then((response) => {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    })
    .catch((err) => {
      throw err;
    });
});

test('GET 400 to /api/login for unsuccessful login with bad username and password', () => {
  return superagent.get(`${apiUrl}/login`)
    .auth('INCORRECT USERNAME', 'INCORRECT PASSWORD')
    .then((response) => {
      throw response;
    })
    .catch((err) => {
      expect(err.status).toEqual(400);
    });
});
