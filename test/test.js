var express     = require("express");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');
var expect      = require('expect.js');
var app         = express();
var json_api    = require("../index");
var request     = require('request');
var httpUtils   = require('request-mocha')(request);

var server;
var resource_id = "abcdefg";
var store = new Datastore({ inMemoryOnly: true, autoload: true });

app.use(bodyParser.json());

app.use("/data/resources", json_api(store));

app.get("/", function(req, res) {
  res.send("Server Running");
});

var startServer = function(){
  server = app.listen(8025);
};
var stopServer = function(){
  server.close();
};

describe('Test Server', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save('http://localhost:8025/');
  
  it('should be running', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(this.body).to.equal('Server Running');
  });
});

describe('POST data to mounted URL', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save({
    method: 'POST',
    url: 'http://localhost:8025/data/resources',
    json: {
      foo: 'bar',
      _id: resource_id
    }
  });
  
  it('creates a record', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(this.body.foo).to.equal("bar");
  });
});

describe('GET mounted URL', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save({
    method: 'GET',
    url: 'http://localhost:8025/data/resources'
  });
  
  it('returns records', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)).to.be.an('array');
  });
});

describe('GET /:id', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save({
    method: 'GET',
    url: 'http://localhost:8025/data/resources/' + resource_id
  });
  
  it('returns a single record with matching id', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(JSON.parse(this.body)._id).to.equal(resource_id);
  });
});

describe('PUT data to /:id', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save({
    method: 'PUT',
    url: 'http://localhost:8025/data/resources/' + resource_id,
    json: {foo: "bam"}
  });
  
  it('updates the record with matching id', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
    expect(this.body._id).to.equal(resource_id);
    expect(this.body.foo).to.equal("bam");
  });
});

describe('DELETE /:id', function () {
  before(startServer);
  after(stopServer);

  httpUtils.save({
    method: 'DELETE',
    url: 'http://localhost:8025/data/resources/' + resource_id
  });
  
  it('deletes the record with matching id', function () {
    expect(this.err).to.equal(null);
    expect(this.res.statusCode).to.equal(200);
  });
});