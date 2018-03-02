const db = require('../db');
const Admin = require('../models/admin');
const jwt = require('../utils/jwt');
const {
  OK,
  INVALID_PROPS,
  ACCOUNT_NOT_FOUND
} = require('../constants/responses');

const ADMIN_COLLECTION = 'admin';


/**
 * create account
 * @param {object} body request body
 *
 * @return {object} json response
 */
async function create(body) {
  const account = new Admin(body);

  if (account.secret !== process.env.ADMIN_SECRET || !account.isValid()) {
    throw new Error(INVALID_PROPS);
  }

  const collection = db.get(ADMIN_COLLECTION);

  const isExisting = (await collection.find({
    username: account.username
  })).length > 0;

  if (isExisting) {
    throw new Error(INVALID_PROPS);
  }

  await collection.insert(account.create());

  db.close();

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
  const account = new Admin(body);
  const collection = db.get(ADMIN_COLLECTION);
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

  return jwt.generate({
    username: account.username,
    type: 'admin'
  });
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
    const user = jwt.verify(token);
    const isTokenValid = username === user.username && user.type === 'admin';

    return isTokenValid
      ? resolve(OK)
      : reject();
  });
}


module.exports = {
  create,
  login,
  verify
};
