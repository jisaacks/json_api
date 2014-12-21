module.exports = function(db) {
  // DB methods
  var getRecords, createRecord, findRecord, updateRecord, deleteRecord;
  // REST actions
  var index, create, show, update, destroy;
  // handlers
  var handleCollection, handleMember;

  // -- DB METHODS -- //

  getRecords = function(cb) {
    db.find({}, function(err, records){
      if (err) {
        throw err;
      } else { 
        cb(records);
      }
    });
  };

  createRecord = function(data, cb) {
    db.insert(data, function(err, record){
      if (err) {
        throw err;
      } else { 
        cb(record);
      }
    });
  };

  findRecord = function(id, cb) {
    db.find({_id: id}, function(err, records){
      if (err) {
        throw err;
      } else if (records.length) { 
        cb(records[0]);
      } else {
        throw new Error("Not found!");
      }
    });
  };

  updateRecord = function(id, record, cb) {
    db.update({_id: id}, record, {}, function(err, numUpdated){
      if (err) {
        throw err;
      } else { 
        cb(numUpdated);
      }
    });
  };

  deleteRecord = function(id, cb) {
    db.remove({_id: id}, {}, function(err, numRemoved){
      if (err) {
        throw err;
      } else { 
        cb(numRemoved);
      }
    });
  };

  // -- REST ACTIONS -- //

  index = function(req, res){
    getRecords(function(records){
      res.json(records);
    });
  };

  create = function(req, res){
    createRecord(req.body, function(record){
      res.json(record);
    });
  };

  show = function(req, res){
    findRecord(req.param("id"), function(record){
      res.json(record);
    });
  };

  update = function(req, res){
    updateRecord(req.param("id"), req.body, function(record){
      findRecord(req.param("id"), function(record){
        res.json(record);
      });
    });
  };

  destroy = function(req, res){
    deleteRecord(req.param("id"), function(record){
      res.status(200).end();
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
        throw new Error("Don't know how to " + req.method + " collection");
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
        throw new Error("Don't know how to " + req.method + " member");
      break;
    }
  }

  // -- THE MIDDLEWARE -- //

  return function(req, res, next) {
    var rgx = /^\/([^/]*)\/?$/;
    if ( req.url === "/" ) {
      handleCollection(req, res);
    }
    else if ( matches = req.url.match(rgx) ) {
      req.params.id = matches[1];
      handleMember(req, res);
    }
    else {
      next();
    }
  }
}