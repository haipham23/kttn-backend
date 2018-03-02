const adminServices = require('../services/adminServices');
const {
  INVALID_TOKEN
} = require('../constants/responses');

/**
 * create account
 * @param {object} req request object
 * @param {object} res response object
 */
function create(req, res) {
  adminServices
    .create(req.body)
    .then((result) => res.json(result))
    .catch((error) => res.status(400).json(error.message));
}


/**
 * login
 * @param {object} req request object
 * @param {object} res response object
 */
function login(req, res) {
  adminServices
    .login(req.body)
    .then((result) => res.json(result))
    .catch((error) => res.status(400).json(error.message));
}


/**
 * verify
 * @param {object} req request object
 * @param {object} res response object
 */
function verify(req, res) {
  adminServices
    .verify(req.body)
    .then((result) => res.json(result))
    .catch((error) => res.status(400).json(INVALID_TOKEN));
}


module.exports = {
  create,
  login,
  verify
};
