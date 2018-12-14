var protobuf = require('protocol-buffers-schema')
var mappings = {
  'array': 'repeated',
  'object': 'message',
  'integer': 'int32',
  'number': 'int32',
  'string': 'string',
  'boolean': 'bool'
}

module.exports = function (schema) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  var result = {
    syntax: 2,
    package: null,
    enums: [],
    messages: []
  }

  if (schema.type === 'object') {
    result.messages.push(Message(schema))
  }
  return protobuf.stringify(result)
}

function Message (schema) {
  var message = {
    name: schema.name,
    enums: [],
    messages: [],
    fields: []
  }

  var tag = 1
  for (var key in schema.properties) {
    var field = schema.properties[key]
    if (field.type === 'object') {
      field.name = key
      message.messages.push(Message(field))
    } else {
      field.name = key
      message.fields.push(Field(field, tag, message))
      tag += 1
    }
  }

  for (var i in schema.required) {
    var required = schema.required[i]
    for (var i in message.fields) {
      var field = message.fields[i]
      if (required === field.name) field.required = true
    }
  }

  return message
}

function Field(field, tag, message) {
  var type = mappings[field.type] || field.type
  var repeated = false

  if (field.type === 'array') {
    repeated = true
    if (field.items.type === 'object') {
      field.items.name = field.name;
      message.messages.push(Message(field.items))
      type = field.name
    } else {
      type = field.items.type
    }

  }

  return {
    name: field.name,
    type: type,
    tag: tag,
    repeated: repeated
  }
}
