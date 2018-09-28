const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Noteful API - Users', function() {
  const username = 'exampleUser';
  const password = 'examplePass';

  before(function() {
    this.timeout(5000);
    return mongoose
      .connect(TEST_MONGODB_URI)
      .then(() => User.deleteMany());
  });

  beforeEach(function() {
  });

  afterEach(function() {
    return User.deleteMany();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('/api/users', function() {
    describe('POST', function() {
      it('Should create a new user', function() {
        const testUser = { username, password };

        let res;
        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username');

            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(testUser.username);

            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });

      it('Should reject users with missing username', function() {
        const testUser = { password };

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });



      it('Should reject users with non-trimmed username', function() {
        const testUser = { username: username + ' ', password };

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });


      it('Should reject users with empty username', function() {
        const testUser = { username: '', password};

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });

      it('Should reject users with password less than 8 characters', function() {
        const testUser = { username, password: password.slice(0,7)};

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });

      it('Should reject users with password greater than 72 characters', function() {
        const testUser = { username, password: password.repeat(10)};

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
          });
      });

      it('Should reject users with duplicate username', function() {
        const testUser = { username, password };
        const duplicateUser = { username, password: 'differentPass'};

        return chai.request(app)
          .post('/api/users')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(201);
            return chai.request(app)
              .post('/api/users')
              .send(duplicateUser);
          })
          .then(res => {
            expect(res).to.have.status(422);
          });
        });
     });
   });
 });
// });
