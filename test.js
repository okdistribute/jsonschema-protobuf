var test = require('tape')
var fs = require('fs')
var json2proto = require('./')
var protobuf = require('protocol-buffers-schema')

test('jsonschema', function (t) {
  var schema = fs.readFileSync('test.jsonschema').toString()
  var result = json2proto(JSON.parse(schema))

  var test = fs.readFileSync('test.proto').toString()
  t.deepEquals(protobuf.parse(result), protobuf.parse(test))
  t.end()
})