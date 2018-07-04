'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { createAcctMockPromise, removeAcctMockPromise } from './account-mock';

const createProfileMockPromise = () => {
  const mockData = {};

  return createAcctMockPromise()
    .then((mockAcctData) => {
      mockData.account = mockAcctData.account;
      mockData.token = mockAcctData.token;

      const mockProfile = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        profileImgUrl: faker.random.image(),
        accountId: mockAcctData.account._id,
      };
      return new Profile(mockProfile).save();
    })
    .then((profile) => {
      mockData.profile = profile;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};

const removeAllResources = () => {
  return Promise.all([
    Profile.remove({}),
    removeAcctMockPromise(),
  ]);
};

export { createProfileMockPromise, removeAllResources };
