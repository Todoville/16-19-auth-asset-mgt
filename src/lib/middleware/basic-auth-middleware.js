'use strict';

import HttpErrors from 'http-errors';
import Account from '../../model/account';

export default (request, response, next) => {
  if (!request.headers.authorization) return next(new HttpErrors(400, 'AUTH MIDDLEWARE - invalid request'));

  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();

  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) return next(new HttpErrors(400, 'AUTH, invalid request'));

  return Account.findONe({ username })
    .then((account) => {
      if (!account) return next(new HttpErrors(400, 'BASIC AUTH - invalid request'));
      return account.verifyPasswordPromise(password);
    })
    .then((account) => {
      request.account = account;
      return next();
    })
    .catch(next);
};
