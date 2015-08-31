var test = require('tape')
var json2proto = require('./')

test('jsonschema', function (t) {
  var schema = {
    type: 'object',
    properties: {
      name: {type: 'string'},
      age: {type: 'integer', min: 0, max: 120},
      income: {type: 'number', min: 0},
      universe: {type: 'string', enum: ['Marvel', 'DC']},
      living: {type: 'boolean', default: true},
      alterEgos: {type: 'array', items: {type: 'string'}},
      location: {
        type: 'object',
        properties: {
          city: {type: 'string'},
          state: {type: 'string', regex: /[A-Z]{2}/}
        }
      }
    }
  }
  console.log(JSON.stringify(json2proto(schema)))
})