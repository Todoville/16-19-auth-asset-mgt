'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jsonWebToken from 'jsonwebtoken';
import HttpErrors from 'http-errors';

require('dotenv').config();

const HASH_ROUNDS = 8;
const TOKEN_SEED_LENGTH = 64;

const accountSchema = mongoose.Schema({
  passwordHash: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

accountSchema.methods.verifyPasswordPromise = function verifyPasswordPromise(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then((result) => {
      if (!result) {
        throw new HttpErrors(401, 'ACCOUNT MODEL: incorrect data');
      }
      return this;
    })
    .catch((err) => {
      if (err.status === 401) {
        throw err;
      } else {
        throw new HttpErrors(500, `ERROR CREATING TOKEN: ${JSON.stringify(err)}`);
      }
    });
};

accountSchema.methods.createTokenPromise = function createTokenPromise() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((updatedAccount) => {
      return jsonWebToken.sign({ tokenSeed: updatedAccount.tokenSeed }, process.env.SECRET_KEY);
    })
    .catch((err) => {
      throw new HttpErrors(500, `ERROR CREATING TOKEN: ${JSON.stringify(err)}`);
    });
};

const skipInit = process.env.NODE_ENV === 'development';

const Account = mongoose.model('accounts', accountSchema, 'accounts', skipInit);

Account.create = (username, email, password) => {
  if (!username || !email || !password) throw new HttpErrors(400, 'ERROR: REQUIRED FIELD NOT SUBMITTED');

  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; /* eslint-disable-line */
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        passwordHash,
        tokenSeed,
      }).save();
    })
    .catch((err) => {
      throw err;
    });
};

export default Account;
