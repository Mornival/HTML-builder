const fs = require("fs");
let readStream = new fs.createReadStream("01-read-file/text.txt","utf-8");
readStream.on("data", function(info){
    console.log(info);
});
