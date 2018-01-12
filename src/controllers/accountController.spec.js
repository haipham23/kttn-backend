const { expect } = require('chai');
const request = require('supertest');

const app = require('../index');
const jwt = require('../utils/jwt');

describe('Account Create Controller', () => {
  const INVALID_ACCOUNT_1 = {};

  const INVALID_ACCOUNT_2 = {
    fullName: 'Test User',
    username: 'user$name2',
    password: 'password2',
    email: 'test@example.com'
  };

  const INVALID_ACCOUNT_3 = {
    fullName: 'Test User',
    username: 't',
    password: 'passw$ord2',
    email: 'test@example.com'
  };

  const INVALID_ACCOUNT_4 = {
    fullName: 'Test User',
    username: 'username2',
    password: 'password2',
    email: 'test@exam$ple'
  };

  const VALID_ACCOUNT = {
    fullName: 'Test User',
    username: 'username',
    password: 'password',
    email: 'test@example.com'
  };

  it('should fail - missing information', (done) => {
    request(app)
      .post('/api/account/create')
      .send(INVALID_ACCOUNT_1)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_PROPS');
        done();
      });
  });

  it('should fail - username, password, email do not meet requirements - 1',
    (done) => {
    request(app)
      .post('/api/account/create')
      .send(INVALID_ACCOUNT_2)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_PROPS');
        done();
      });
  });

  it('should fail - username, password, email do not meet requirements - 2',
    (done) => {
    request(app)
      .post('/api/account/create')
      .send(INVALID_ACCOUNT_3)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_PROPS');
        done();
      });
  });

  it('should fail - username, password, email do not meet requirements - 3',
    (done) => {
    request(app)
      .post('/api/account/create')
      .send(INVALID_ACCOUNT_4)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_PROPS');
        done();
      });
  });

  it('should success and create new account', (done) => {
    request(app)
      .post('/api/account/create')
      .send(VALID_ACCOUNT)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(200);
        expect(res.body).to.equal('OK');
        done();
      });
  });

  it('should fail - account exists', (done) => {
    request(app)
      .post('/api/account/create')
      .send(VALID_ACCOUNT)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_PROPS');
        done();
      });
  });
});


describe('Account Login Controller', () => {
  const INVALID_ACCOUNT_1 = {
    username: 'invalidusername',
    password: 'password1'
  };

  const INVALID_ACCOUNT_2 = {
    username: 'validusername',
    password: 'invalidpassword'
  };

  const VALID_ACCOUNT = {
    username: 'validusername',
    password: 'validpassword'
  };

  it('should fail - invalid username', (done) => {
    request(app)
      .post('/api/account/login')
      .send(INVALID_ACCOUNT_1)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('ACCOUNT_NOT_FOUND');
        done();
      });
  });

  it('should fail - invalid password', (done) => {
    request(app)
      .post('/api/account/login')
      .send(INVALID_ACCOUNT_2)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('ACCOUNT_NOT_FOUND');
        done();
      });
  });

  it('should success', (done) => {
    request(app)
      .post('/api/account/login')
      .send(VALID_ACCOUNT)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(200);
        expect(res.body).to.be.string;
        done();
      });
  });
});


describe('Account Verify Controller', () => {
  const INVALID_TOKEN_1 = {
    token: 'invalidtoken'
  };

  const INVALID_TOKEN_2 = {
    username: 'invalidusername'
  };

  const INVALID_TOKEN_3 = {
    token: 'invalidtoken',
    username: 'invalidusername'
  };

  const VALID_TOKEN = {
    token: jwt.generate('validusername'),
    username: 'validusername'
  };

  it('should fail - missing username', (done) => {
    request(app)
      .post('/api/account/verify')
      .send(INVALID_TOKEN_1)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_TOKEN');
        done();
      });
  });

  it('should fail - missing token', (done) => {
    request(app)
      .post('/api/account/verify')
      .send(INVALID_TOKEN_2)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_TOKEN');
        done();
      });
  });

  it('should fail - invalid token', (done) => {
    request(app)
      .post('/api/account/verify')
      .send(INVALID_TOKEN_3)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(400);
        expect(res.body).to.equal('INVALID_TOKEN');
        done();
      });
  });

  it('should success', (done) => {
    request(app)
      .post('/api/account/verify')
      .send(VALID_TOKEN)
      .end((err, res) => {
        expect(err).to.not.exist;
        expect(res.status).to.equal(200);
        expect(res.body).to.equal('OK');
        done();
      });
  });
});
