const _ = require('lodash');
const Ajv = require('ajv');
const bcrypt = require('bcryptjs');
const schema = require('./account.json');
const logger = require('../utils/logger');

const ajv = new Ajv();
const validate = ajv.compile(schema);

const Account = class Account {
  /**
   * constructor
   *
   * @param {object} o initital object
   */
  constructor(o = {}) {
    this.fullName = _.trim(o.fullName);
    this.username = _.toLower(_.trim(o.username));
    this.email = _.trim(o.email);
    this.password = _.trim(o.password);
    this.isActive = true;
  }

  /**
   * check if object is valid
   *
   * @return {bool} object is valid
   */
  isValid() {
    const valid = validate(this);

    if (!valid) {
      logger.debug('-- account model: --', validate.errors);
    }

    return valid;
  }

  /**
   * hash password using bcrypt
   *
   * @param {string} password raw password
   *
   * @return {string} hashed password
   */
  hash(password) {
    return bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10)
    );
  }

  /**
   * compare hashed passwords
   *
   * @param {string} hash raw password
   *
   * @return {bool} if passwords match
   */
  compare(hash) {
    return bcrypt.compare(this.password, hash);
  }

  /**
   * create account
   *
   * @return {object} account
   */
  create() {
    return {
      fullName: this.fullName,
      username: this.username,
      password: this.hash(this.password),
      email: this.email
    };
  }
};

module.exports = Account;
