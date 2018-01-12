const jwt = require('jsonwebtoken');
const getenv = require('getenv');

/**
 * generate jwt
 *
 * @param {string} username username
 *
 * @return {string} jwt
 */
function generate(username) {
  return jwt.sign(
    { user: username },
    getenv('JWT_SECRET'),
    { expiresIn: '2 days' }
  );
}


/**
 * verify jwt token
 *
 * @param {string} token
 *
 * @return {string} username
 */
function verify(token) {
  const { user } = jwt.verify(token, getenv('JWT_SECRET'));

  return user;
}

module.exports = {
  generate,
  verify
};
