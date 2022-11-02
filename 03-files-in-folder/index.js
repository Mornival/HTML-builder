const fs = require("fs");
const path = require("path");
let filesNames = [];
fs.readdir(path.join(__dirname,"secret-folder"),  function (error,data){
    if(error) throw error;    
    filesNames = data;
    second();
});
function second(){
    for(let i = 0; i < filesNames.length; i++){
        fs.stat(path.join(__dirname, "secret-folder", filesNames[i]), function (error, stats) {
            if(stats.isFile()){
                console.log(`${path.parse(filesNames[i]).name} - ${path.extname(filesNames[i]).substr(1)} - ${(stats.size/1024).toFixed(3)}kb`);
            }
        });
    }
}