var deref = require("json-schema-deref");
var fs = require("fs");
var convert = require("./");

var args = process.argv.slice(2);
var inDir = args[0];
var outDir = args[1];
startLocal(inDir, outDir);

module.exports = function start(inDir, outDir) {
  startLocal(inDir, outDir);
};
function startLocal(inDir, outDir) {
  var schemaFiles = fs.readdirSync(inDir);
  schemaFiles.forEach(async schemaFile => {
    if(schemaFile.split('.').pop() !== "json"){
      return;
    }
    var schemaString = fs.readFileSync(inDir + "/" + schemaFile);
    var schemaFromFile = JSON.parse(schemaString);
    var outFileNameBase = schemaFile.split(".").shift();
    var outFile = outDir + "/" + outFileNameBase + ".proto";
    try {
      var expandedSchema = await derefSchema(schemaFromFile);
      var jsonString = JSON.stringify(expandedSchema, null, 2);
      protobuf = convert(jsonString);
      fs.writeFileSync(outFile, protobuf);
      console.log("Generated " + outFile);      
    } catch (error) {
      console.error("Problem generating " + outFile);      
      process.exit(1);
    }
  });
}

function derefSchema(schemaFromFile) {
  return new Promise(async (resolve, reject) => {
    deref(schemaFromFile, (err, expandedSchema) => {
      if (err) {
        console.error(
          "Dereferencing schema failed for file " +
            schemaFile +
            ". " +
            err.message
        );
        reject();
      }
      resolve(expandedSchema);
    });
  });
}
