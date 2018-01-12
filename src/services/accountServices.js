const db = require('../db');
const Account = require('../models/account');
const jwt = require('../utils/jwt');
const logger = require('../utils/logger');
const {
  OK,
  INVALID_PROPS,
  ACCOUNT_NOT_FOUND
} = require('../constants/responses');

const ACCOUNT_COLLECTION = 'accounts';


/**
 * create account
 * @param {object} body request body
 *
 * @return {object} json response
 */
async function create(body) {
  const account = new Account(body);

  logger.info('BEFORE CHECK ACC');

  if (!account.isValid()) {
    throw new Error(INVALID_PROPS);
  }

  logger.info('BEFORE DB, ACC VALID');

  const collection = db.get(ACCOUNT_COLLECTION);

  logger.info('AFTER DB, BEFORE CHECK DUP');

  const isExisting = (await collection.find({
    $or: [{
      username: account.username
    }, {
      email: account.email
    }]
  })).length > 0;

  logger.info('AFTER CHECK DUP');

  if (isExisting) {
    throw new Error(INVALID_PROPS);
  }

  logger.info('BEFORE INSERT');

  await collection.insert(account.create());

  logger.info('AFTER INSERT, BEFORE CLOSE DB');

  db.close();

  logger.info('AFTER CLOSE DB');

  return OK;
}


/**
 * login
 *
 * @param {object} body
 *
 * @return {object} json response
 */
async function login(body) {
  const account = new Account(body);
  const collection = db.get(ACCOUNT_COLLECTION);
  const user = await collection.findOne({
    username: account.username
  }, {
    fields: { username: 1, password: 1 }
  });

  db.close();

  if (!user) {
    throw new Error(ACCOUNT_NOT_FOUND);
  }

  const isMatch = await account.compare(user.password);

  if (!isMatch) {
    throw new Error(ACCOUNT_NOT_FOUND);
  }

  return jwt.generate(account.username);
}


/**
 * verify
 *
 * @param {string} body
 *
 * @return {Promise} username
 */
function verify(body) {
  return new Promise((resolve, reject) => {
    const { token, username } = body;

    if (
      !token ||
      !username ||
      username !== jwt.verify(token)) {
      return reject();
    }

    resolve(OK);
  });
}

/**
 * getUsername
 *
 * @param {string} token
 *
 * @return {string} username
 */
function getUsername(token) {
  return new Promise((resolve, reject) => {
    const username = jwt.verify(token);

    return resolve(username);
  });
}


module.exports = {
  create,
  login,
  verify,
  getUsername
};
