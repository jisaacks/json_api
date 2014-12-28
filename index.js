var JsonApiError = require("./json_api_error");

module.exports = function(db) {
  // DB methods
  var getRecords, createRecord, findRecord, updateRecord, deleteRecord;
  // REST actions
  var index, create, show, update, destroy;
  // handlers
  var handleCollection, handleMember;

  // -- DB METHODS -- //

  getRecords = function(cb, scope) {
    db.find(scope || {}, cb);
  };

  createRecord = function(data, cb) {
    db.insert(data, cb);
  };

  findRecord = function(id, cb) {
    db.find({_id: id}, function(err, records){
      if (err || records.length) {
        cb(err, records[0]);
      } else {
        cb(new JsonApiError.NotFound());
      }
    });
  };

  updateRecord = function(id, record, cb) {
    db.update({_id: id}, record, {}, cb);
  };

  deleteRecord = function(id, cb) {
    db.remove({_id: id}, {}, cb);
  };

  // -- REST ACTIONS -- //

  index = function(req, res){
    getRecords(function(err, records){
      if (err) {
        res.status(500).json({error: err.toString()});
      } else {
        res.json(records);
      }
    }, req.param("scope"));
  };

  create = function(req, res){
    createRecord(req.body, function(err, record){
      if (err) {
        res.status(500).json({error: err.toString()});
      } else {
        res.json(record);
      }
    });
  };

  show = function(req, res){
    findRecord(req.param("id"), function(err, record){
      if (err && err instanceof JsonApiError.NotFound) {
        res.status(404).end();
      } else if (err) {
        res.status(500).json({error: err.toString()});
      } else {
        res.json(record);
      }
    });
  };

  update = function(req, res){
    updateRecord(req.param("id"), req.body, function(err, numUpdated){
      if (err) {
        res.status(500).json({error: err.toString()});
      } else {
        findRecord(req.param("id"), function(err, record){
          if (err) {
            res.status(500).json({error: err.toString()});
          } else {
            res.json(record);
          }
        });
      }
    });
  };

  destroy = function(req, res){
    deleteRecord(req.param("id"), function(err, record){
      if (err) {
        res.status(500).json({error: err.toString()});
      } else {
        res.status(200).end();
      }
    });
  };

  // -- HANDLERS -- //

  handleCollection = function(req, res) {
    switch(req.method) {
      case "GET":
        index(req, res);
      break;
      case "POST":
        create(req, res);
      break;
      default:
        var err = new JsonApiError.InvalidRequest("Don't know how to " + req.method + " collection");
        res.status(500).json({error: err.toString()});
      break;
    }
  },

  handleMember = function(req, res) {
    switch(req.method) {
      case "GET":
        show(req, res);
      break;
      case "PUT":
        update(req, res);
      break;
      case "DELETE":
        destroy(req, res);
      break;
      default:
        var err = new JsonApiError.InvalidRequest("Don't know how to " + req.method + " member");
        res.status(500).json({error: err.toString()});
      break;
    }
  }

  // -- THE MIDDLEWARE -- //

  return function(req, res, next) {
    // Member Regex
    var memRgx = /^\/([^/]*)\/?(?=\?|$)/;
    // Collection Regex
    var colRgx = /^\/(?=\?|$)/;

    if ( req.url.match(colRgx) ) {
      handleCollection(req, res);
    }
    else if ( matches = req.url.match(memRgx) ) {
      req.params.id = matches[1];
      handleMember(req, res);
    }
    else {
      next();
    }
  }
}
