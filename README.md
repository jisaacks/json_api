# JSON API

A simple middleware for mounting a RESTful JSON API

## Usage

Add as a middleware

```javascript
var Datastore = require('nedb');
var store     = new Datastore({ filename: "path/to/file", autoload: true });
var json_api  = require("json_api");

app.use("/path/to/mount/to", json_api(store));
```
create a record:

```shell
curl -4 -X POST -H "Content-Type: application/json" -d '{"name":"curl"}' http://localhost:8025/path/to/mount/to
```

get a record:

```shell
curl -4 -X GET -H "Content-Type: application/json" http://localhost:8025/path/to/mount/to/<resource-id>
```

I have only tested with NeDB but should also work with MongoDB

Check out the tests to see more usage examples.

## Testing

```shell
npm install -g mocha
mocha
```