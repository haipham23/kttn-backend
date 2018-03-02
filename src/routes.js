/* eslint new-cap: ["error", { "properties": false }] */
const router = require('express').Router();

const accountController = require('./controllers/accountController');
const adminController = require('./controllers/adminController');
const { version } = require('../package.json');

const route = (app) => {
  router.get('/version', (req, res) => res.json(version));

  /* Accounts */
  router.post('/account/create', accountController.create);
  router.post('/account/login', accountController.login);
  router.post('/account/verify', accountController.verify);

  /* Admin */
  router.post('/admin/create', adminController.create);
  router.post('/admin/login', adminController.login);
  router.post('/admin/verify', adminController.verify);

  /* General */
  app.use('/api', router);
};

module.exports = route;
