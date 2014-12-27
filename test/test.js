var express     = require("express");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var request     = require('supertest');
var app         = express();
var json_api    = require("../index");

var resource_id = "abcdefg";
var store       = new Datastore({ inMemoryOnly: true, autoload: true });

app.use(bodyParser.json());

app.use("/data/resources", json_api(store));

describe('JSON API', function () {
  describe('POST data to mounted URL', function () {
    it('creates a record', function (done) {
      request(app)
        .post("/data/resources")
        .set("Accept", "application/json")
        .send({foo: "bar", _id: resource_id})
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          expect(res.body.foo).to.equal("bar");
          done(err);
        });
    });
  });

  describe('GET mounted URL', function () {
    it('returns records', function (done) {
      request(app)
        .get("/data/resources")
        .set("Accept", "application/json")
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("array");
          done(err);
        });
    });
  });

  describe('GET /:id', function () {
    it('returns a single record with matching id', function (done) {
      request(app)
        .get("/data/resources/" + resource_id)
        .set("Accept", "application/json")
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          expect(res.body._id).to.be.equal(resource_id);
          done(err);
        });
    });

    it('repsonds with 404 for missing record', function (done) {
      request(app)
        .get("/data/resources/missing")
        .set("Accept", "application/json")
        .end(function(err, res){
          expect(res.statusCode).to.equal(404);
          done(err);
        });
    });
  });

  describe('PUT data to /:id', function () {
    it('updates the record with matching id', function (done) {
      request(app)
        .put("/data/resources/" + resource_id)
        .set("Accept", "application/json")
        .send({foo: "bam"})
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          expect(res.body._id).to.equal(resource_id);
          expect(res.body.foo).to.equal("bam");
          done(err);
        });
    });
  });

  describe('DELETE /:id', function () {
    it('deletes the record with matching id', function (done) {
      request(app)
        .delete("/data/resources/" + resource_id)
        .set("Accept", "application/json")
        .end(function(err, res){
          expect(res.statusCode).to.equal(200);
          done(err);
        });
    });
  });
});

