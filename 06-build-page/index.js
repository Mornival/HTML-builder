const fs = require("fs");
const path = require("path");
let resultInnerHTML = "";
let filesNames = [];
let fullData = "";
let firstDataOfIndex = [];
let secondDataOfIndex = [];
let nameOfElements = [];
let positionOfElement = [];
let readyForCreate = true;
let readStream = new fs.createReadStream(path.join(__dirname, "template.html"),"utf-8");
readStream.on("data", function(info){
    for(let i = 0; i < info.length; i++){
        if(info[i - 1] == '{' && info[i - 2] == '{'){
            let word = "";
            positionOfElement.push(i - 2);
            while(info[i] != '}'){
                word += info[i];
                i++;
            }
            nameOfElements.push(word);
            positionOfElement.push(i + 2);
        }
    }
    dataNewFile(info);
});
start();
async function start(){
    deleteFolder(path.join(__dirname,"project-dist"));
}
function dataNewFile(data) {
    let j = 0;
    let k = 0;
    for (let i = 0; i < data.length; i++) {
        firstDataOfIndex.push(data.substring(i, positionOfElement[j]));
        if (k < nameOfElements.length) {
            nameOfElements[k] += ".html";
            let stream = new fs.createReadStream(path.join(__dirname, "components", nameOfElements[k]), "utf-8");
            stream.on("data", function (info) {
                if(info){
                    secondDataOfIndex.push(info);
                    fs.readdir(path.join(__dirname), function(error,data){
                        packHTML();
                    });
                }
            });
        }
        k++;
        i = positionOfElement[j + 1];
        j += 2;
    }
}
async function deleteFolder(pathFolder){
    fs.readdir(pathFolder, function(error,data){
        if(data){
            for(let i = 0; i <  data.length; i++){
                let curPath = path.join(pathFolder, data[i]);
                fs.stat(curPath, function(error,stats){
                    if(!error){
                        if(!stats.isFile()){
                            deleteFolder(curPath);
                            deleteFolder(pathFolder);
                        } else{
                            fs.unlink(curPath, (error) => {});
                        }
                    }
                });
            }
            fs.rmdir(pathFolder, (error) => {});
        }
    });
    createFolder();
}
async function createFolder(){
    fs.mkdir(path.join(__dirname, "project-dist"),{recursive: true} ,(error) => {
        fs.mkdir(path.join(__dirname, "project-dist","assets"),{recursive: true} ,(error) => {
            copyFolder(path.join(__dirname, "assets"),path.join(__dirname, "project-dist","assets"));
        });
        fs.readdir(path.join(__dirname,"styles"),  function (error,data){
            if(error) throw error;
            filesNames = data;
            if(readyForCreate){
                isTrueFiles();
                readyForCreate = false;
            }
        });
    });
}
async function isTrueFiles() {
    for (let i = 0; i < filesNames.length; i++) {
        fs.stat(path.join(__dirname, "styles", filesNames[i]), function (error, stats) {
            if (stats.isFile() && path.extname(filesNames[i]).substr(1) == "css") {
                let readStream = new fs.createReadStream(path.join(__dirname, "styles",filesNames[i]),"utf-8");
                readStream.on("data", function(info){
                    fullData += info;
                    console.log(fullData.length)
                    fs.stat(path.join(__dirname, "styles", filesNames[i]), function (error, stats) {
                        let writeStream = new fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"));
                        writeStream.write(fullData);
                    });
                    let writeStream = new fs.createWriteStream(path.join(__dirname,"project-dist","index.html"));
                    writeStream.write(resultInnerHTML);
                });
            }
        });
    }
}
async function copyFolder(pathFolder,pathCopyFolder){
    fs.readdir(pathFolder, function(error,data){
        if(data){
            for(let i = 0; i < data.length; i++){
                let curPath = path.join(pathFolder,data[i]);
                let curCopyPath = path.join(pathCopyFolder,data[i]);
                fs.stat(curPath, function(error,stats){
                    if(!error){
                        if(!stats.isFile()){
                            copyFolder(curPath,curCopyPath);
                            fs.mkdir(path.join(pathCopyFolder,data[i]),{recursive: true} ,(error) => {
                            });
                        } else{
                            fs.copyFile(path.join(pathFolder,data[i]),path.join(pathCopyFolder,data[i]), (error) =>{});
                        }
                    }
                });
            }
        }
    });
}
function packHTML(){
    resultInnerHTML = "";
    for(let i = 0; i < firstDataOfIndex.length; i++){
        resultInnerHTML += firstDataOfIndex[i];
        if(secondDataOfIndex.length > i){
            resultInnerHTML += secondDataOfIndex[i];
        }
    }
    console.log("we build it" + resultInnerHTML.length);
}