var mappings = {
  'array': 'repeated',
  'object': 'message',
  'integer': 'int32',
  'number': 'int32',
  'string': 'string',
  'boolean': 'boolean'
}

module.exports = function (schema) {
  var protobuf = {
    syntax: 2,
    package: null,
    enums: [],
    messages: []
  }

  if (schema.type === 'object') {
    protobuf.messages.push(Message(schema))
  }
  return protobuf
}

function Message (schema) {
  var message = {
    name: schema.name,
    enums: [],
    messages: [],
    fields: []
  }

  var tag = 0
  for (var key in schema.properties) {
    var field = schema.properties[key]
    if (field.type === 'object') {
      field.name = key
      message.messages.push(Message(field))
    } else {
      field.name = key
      message.fields.push(Field(field, tag))
      tag += 1
    }
  }

  for (var field in schema.required) {
    message.fields[message.fields.indexOf(field)].required = true
  }

  return message
}

function Field (field, tag) {
  var type = mappings[field.type] || field.type

  var repeated = type === 'array'
  if (repeated) type = field.items.type

  return {
    name: field.name,
    type: type,
    tag: tag,
    repeated: repeated
  }
}
