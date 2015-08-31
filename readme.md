# jsonschema-protobuf
[![NPM](https://nodei.co/npm/jsonschema-protobuf.png)](https://nodei.co/npm/jsonschema-protobuf/)

Converts [JSON Schema](http://json-schema.org/) to [Protocol Buffers](https://developers.google.com/protocol-buffers).

## Install
```
npm install -g jsonschema-protobuf
```

## Example
```
$ jsonschema-protobuf test.jsonschema
syntax = "proto2";

message person {
  message location {
    optional string city = 0;
    optional string state = 1;
  }

  required string name = 0;
  required int32 age = 1;
  required int32 income = 2;
  optional string universe = 3;
  optional boolean living = 4;
  repeated string alterEgos = 5;
}
```

test.jsonschema
```
{
  "type": "object",
  "name": "person",
  "properties": {
    "name": {"type": "string"},
    "age": {"type": "integer", "min": 0, "max": 120},
    "income": {"type": "number", "min": 0},
    "universe": {"type": "string", "enum": ["Marvel", "DC"]},
    "living": {"type": "boolean", "default": true},
    "alterEgos": {"type": "array", "items": {"type": "string"}},
    "location": {
      "type": "object",
      "properties": {
        "city": {"type": "string"},
        "state": {"type": "string", "regex": "/[A-Z]{2}/"}
      }
    }
  },
  "required": ["name", "age", "income"]
}
```

## JS usage

```js
var convert = require('jsonschema-protobuf')
var jsonschema = fs.readFileSync("test.jsonschema").toString()
var protobuf = convert(jsonschema)
console.log(protobuf)
```

## TODO

* Enum
