#!/usr/bin/env node
var args = process.argv.splice(2)
var convert = require('./')
var fs = require('fs')

var file = args[0]
var protobuf = convert(fs.readFileSync(file).toString())
process.stdout.write(protobuf)