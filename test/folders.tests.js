const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const folders  = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('this describe wraps everything', function(){
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Folder.insertMany(folders);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('PUT /api/folders/:id', function () {

    it('should update the folder', function () {
      const updateItem = {'name': 'Updated Name'};
      let data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put(`/api/folders/${data.id}`).send(updateItem);
        })
         .then(function (res) {
           expect(res).to.have.status(200);
           expect(res).to.be.json;
          });
    });

    it('should respond with a 400 for an invalid id', function () {
      return chai.request(app)
        .put('/api/folders/1231231239192321390-19230-')
        .send({'title': 'New', 'content': 'New Content'})
        .then(res => {
          expect(res).to.have.status(400);
        });
    });
  });

  describe('DELETE  /api/folders/:id', function () {
    it('should delete an item by id', function () {
      return chai.request(app)
        .delete('/api/folders/111111111111111111111103')
        .then(res => {
          expect(res).to.have.status(204);
        });
      });
    });

  describe('GET /api/folders/:id', function(){
    it('should respond with a 400 and an error message when `id` is not valid', function(){
    return chai.request(app)
      .get('/api/folders/NOT-A-VALID-ID')
      .then(res=>{
        expect(res).to.have.status(400);
      });
      it('should respond with a 204', function(){
        return chai.request(app)
        .get('/api/folders/111111111111111111111102')
        .then(res=>{
          expect(res).to.have.status(200);
        });
      });
    });
  });

describe('GET /api/folders', function(){
  it('should respond with a 200 error', function(){
    return chai.request(app)
      .get('/api/folders')
        .then(res=>{
          expect(res).to.have.status(200);
        });
      });
  });

  describe('404 handler', function(){
  it('should respond with 404 when given a bad path', function(){
    return chai.request(app)
      .get('/api/123424')
      .then(res => {
        console.log(res);
        expect(res).to.have.status(404);
      });
  });
});

  describe('GET /api/folder', function(){
    it('should respond with a 404 error', function(){
      return chai.request(app)
        .get('/api/folder')
          .then(res=>{
            expect(res).to.have.status(404);
          });
        });
     });

describe('POST /api/folders', function(){
  it('should respond with a 201 code', function(){
    return chai.request(app)
    .post('/api/folders')
    .send({'title': 'hello', 'content': 'goodbye'})
    .then(res => {
        console.log(res.body);
        expect(res.body).to.be.an('object');
      });
    });
  it('should return an error when missing "title" field', function(){
    return chai.request(app)
      .post('/api/folders')
      .send({'content': 'asdfasdf'})
      .then(response => {
        expect(response).to.have.status(400);
     });
   });
  });
}); //wrapper end
