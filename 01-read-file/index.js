const fs = require("fs");
const path = require("path");
let readStream = new fs.createReadStream(path.join(__dirname, "text.txt"),"utf-8");
readStream.on("data", function(info){
    console.log(info);
});
