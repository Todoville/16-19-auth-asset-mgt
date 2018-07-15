'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import { createAccountMockPromise } from './lib/account-mock';
import { removeAllResources } from './lib/profilemock';

const apiUrl = `http://localhost:${process.env.PORT}/api`;

describe('TESTING PROFILE ROUTER MY FOLX', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAllResources);

  test('POST 200 TO /api/profiles for successfuly created profile', () => {
    let accountMockData = null;
    const mockProfile = {
      bio: faker.lorem.words(25),
      firstName: 'Entropy',
      lastName: 'Todoville',
    };
    return createAccountMockPromise()
      .then((mockAccountResponse) => {
        accountMockData = mockAccountResponse;
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountMockData.token}`)
          .send(mockProfile);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.accountId).toEqual(accountMockData.account._id.toString());
        expect(response.body.firstName).toEqual(mockProfile.firstName);
        expect(response.body.lastName).toEqual(mockProfile.lastName);
        expect(response.body.bio).toEqual(mockProfile.bio);
      });
  });
});
