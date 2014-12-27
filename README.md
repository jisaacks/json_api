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

## Similar Projects

- [loopback-connector-rest](https://github.com/strongloop/loopback-connector-rest)

## Why?

If you read this article from StrongLoop about [comparing different libraries for building RESTful APIs](http://strongloop.com/strongblog/compare-express-restify-hapi-loopback/)

I would add this with the following entry:

```javascript
var app   = require("express")();
var Store = require("nedb")
var store = new Store({ filename: "data/items.db", autoload: true });

app.use(require('body-parser').json())
   .use("/items", require("json_api")(store));

app.listen(8025);
```

Pros

1. Very quick RESTful API development
2. Just a simple middleware to inject into your existing workflow
3. Great for prototyping
4. No learning curve
5. Very lightweight (can read entire source in a few minutes)

Cons

1. Only built with NeDB/MongoDB in mind
2. Only inteded for trivial apps, prototypes or stubs
