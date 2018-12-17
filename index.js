var protobuf = require('protocol-buffers-schema')
var mappings = {
  'array': 'repeated',
  'object': 'message',
  'integer': 'int32',
  'number': 'int32',
  'string': 'string',
  'boolean': 'bool'
}

var protoBufRoot = {
  syntax: 2,
  package: null,
  enums: [],
  messages: []
}

module.exports = function (schema) {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  result = protoBufRoot;

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
      protoBufRoot.messages.push(Message(field.items))
      type = field.name
    } else {
      type = field.items.type
    }    
  }else if(field.type === 'string' && field.enum){
    type = field.name + "Enum";
    message.enums.push(Enum(field))
  }


  return {
    name: field.name,
    type: type,
    tag: tag,
    repeated: repeated
  }
}

function Enum(field){
//  var options = {"option1" : 0, "option2" : 1};
   var protoEnum = {
    name: field.name + "Enum",
    options: [],
    values: []
  }

for (var e in field.enum) {
    var enumValue = {  value : e, options : []}
    var enumName = field.enum[e].replace(new RegExp('[.]', 'g'), '_')
    protoEnum.values[enumName] = enumValue;
  };
  return protoEnum;
}
