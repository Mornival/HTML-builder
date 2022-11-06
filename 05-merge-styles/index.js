const fs = require("fs");
const path = require("path");
let filesNames = [];
let trueFiles = [];
let fullData = "";
fs.readdir(path.join(__dirname,"styles"),  function (error,data){
    if(error) throw error;
    filesNames = data;
    start();
});
async function start(){
    deleteFile(path.join(__dirname,"styles","project-dist"));
}
async function isTrueFiles() {
    for (let i = 0; i < filesNames.length; i++) {
        fs.stat(path.join(__dirname, "styles", filesNames[i]), function (error, stats) {
            if (stats.isFile() && path.extname(filesNames[i]).substr(1) == "css") {
                trueFiles.push(filesNames[i]);
                let readStream = new fs.createReadStream(path.join(__dirname, "styles",filesNames[i]),"utf-8");
                readStream.on("data", function(info){
                    fullData += info;
                    fs.stat(path.join(__dirname, "styles", filesNames[i]), function (error, stats){
                        let writeStream = new fs.createWriteStream(path.join(__dirname,"project-dist","bundle.css"));
                        writeStream.write(fullData);
                    });
                });
            }
        });
    }
}
async function deleteFile(pathFolder){
    fs.readdir(path.join(pathFolder,"bundle.css"), function(error,data){
        if(data){
            fs.unlink(path.join(pathFolder,"bundle.css"), (error) => {});
        }
        isTrueFiles();
    });
}

