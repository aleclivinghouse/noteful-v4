const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const  notes  = require('../db/seed/notes');
const  tags  = require('../db/seed/tags');
const  folders  = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('this describe wraps everything', function(){
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
    .then(() => Promise.all([
    Note.deleteMany(),
    Folder.deleteMany(),
    User.deleteMany()
  ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Folder.insertMany(folders),
      Note.insertMany(notes)
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({user}, JWT_SECRET, {subject: user.username});
      });
  });

  afterEach(function () {
    sandbox.restore();
    return Promise.all([
      Note.deleteMany(),
      Folder.deleteMany(),
      User.deleteMany()
    ]);
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('PUT /api/notes/:id', function () {

    it('should update the note', function () {
      return chai.request(app)
        .put('/api/notes/000000000000000000000002')
        .send({'title': 'New', 'content': 'New Content'})
        .then(res => {
          expect(res).to.have.status(200);
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      return chai.request(app)
        .put('/api/notes/1231231239192321390-19230-')
        .send({'title': 'New', 'content': 'New Content'})
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    it('should return an error when missing "title" field', function () {
      return chai.request(app)
        .put('/api/notes/000000000000000000000009')
        .send({'content': 'asdff'})
        .then(response => {
          console.log(response.error);
          expect(response).to.have.status(200);
        });
    });
  });

  describe('DELETE  /api/notes/:id', function () {
    it('should delete an item by id', function () {
      return chai.request(app)
        .delete('/api/notes/000000000000000000000007')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(204);
        });
      });
    });

  describe('GET /api/notes/:id', function(){
    it('should respond with a 404 and an error message when `id` is not valid', function(){
    return chai.request(app)
      .get('/api/notes/NOT-A-VALID-ID')
      .set('Authorization', `Bearer ${token}`)
      .then(res=>{
        expect(res).to.have.status(404);
      });
      it('should respond with a 204', function(){
        return chai.request(app)
        .get('/api/notes/000000000000000000000005')
        .then(res=>{
          expect(res).to.have.status(200);
        });
      });
    });
  });

describe('GET /api/notes', function(){
  it('should respond with a 200 error', function(){
    return chai.request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${token}`)
        .then(res=>{
          expect(res).to.have.status(200);
        });
      });
  });

  describe('404 handler', function(){
  it('should respond with 404 when given a bad path', function(){
    return chai.request(app)
      .get('/api/123424')
      .set('Authorization', `Bearer ${token}`)
      .then(res => {
        console.log(res);
        expect(res).to.have.status(404);
      });
  });
});

  describe('GET /api/note', function(){
    it('should respond with a 404 error', function(){
      return chai.request(app)
        .get('/api/note')
          .then(res=>{
            expect(res).to.have.status(404);
          });
        });
     });

describe('POST /api/notes', function(){
  it('should respond with a 201 code', function(){
    return chai.request(app)
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send({'title': 'hello', 'content': 'goodbye'})
    .then(res => {
        console.log(res.body);
        expect(res.body).to.be.an('object');
      });
    });
  it('should return an error when missing "title" field', function(){
    return chai.request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({'content': 'asdfasdf'})
      .then(response => {
        expect(response).to.have.status(400);
     });
   });
  });
}); //wrapper end
