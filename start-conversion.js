var deref = require('json-schema-deref');
var fs = require('fs');
var convert = require('./')

var args = process.argv.slice(2);
var inFile = args[0];
var outFile = args[1];
let schema = require(inFile);

deref(schema, function(err, exandedSchema) {
    var jsonString = JSON.stringify(exandedSchema, null, 2);
//    process.stdout.write(jsonString);
	var protobuf = convert(jsonString);
    fs.writeFile(outFile, protobuf, function(err) {
        if(err) {
            console.log("Promblem generating " + outFile);
            return console.log(err);
        }    
        console.log("Generated " + outFile + " successfully!");
    }); 
});