const fake = require('./../lib/fake');

describe('Jest working', () => {
  test('#fake', () => {
    expect(fake()).toBe('working');
  });
});

// 'use strict';

// import superagent from 'superagent';
// import faker from 'faker';
// import { startServer, stopServer } from '../lib/server';
// import { createAccountMockPromise } from './lib/account-mock';
// import { removeAllResources } from './lib/profile-mock';

// const apiUrl = `http://localhost:${process.env.PORT}/api`;

// describe('TESTING ROUTER PROFILE', () => {
//   let mockData;
//   let token;
//   let account;
//   beforeAll(async () => {
//     startServer();
//     try {
//       mockData = await createAccountMockPromise();
//     } catch (err) {
//       return console.log(err);
//     }
//   });
// })
