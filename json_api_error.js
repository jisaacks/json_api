// -- The Base Error -- //

function JsonApiError(message) {
  Error.call(this);
  this.message = message;
}
JsonApiError.prototype = new Error();

// -- Error to raise when request is invalid -- //

function JsonApiInvalidRequest(message) {
  JsonApiError.call(this);
  this.message = message;
}
JsonApiInvalidRequest.prototype = new JsonApiError();

// -- Error to raise when Can't find requested record -- //

function JsonApiNotFound(message) {
  JsonApiError.call(this);
  this.message = message || "Not found."
}
JsonApiNotFound.prototype = new JsonApiError();

// -- Attach Sub-errors as properties on base error -- //

JsonApiError.NotFound       = JsonApiNotFound;
JsonApiError.InvalidRequest = JsonApiInvalidRequest;

// -- Export Base Error -- //

module.exports = JsonApiError;