const fs = require("fs");
const path = require("path");
copyDir();
async function copyDir(){
    deleteFolder(path.join(__dirname,"files-copy"), (error) => {});
}
async function ishasDirectory(){
    fs.access(path.join(__dirname, "files-copy"), function (error) {
        if (error) {
            console.log("Не существует!");
            return false;
        }
        else {
            console.log("Есть!");
            return true;
        }
    });
}
function createFolder(){
    console.log("do createFolder");
    fs.mkdir(path.join(__dirname, "files-copy"),{recursive: true} ,(error) => {
        console.log(error);
        copyFolders(path.join(__dirname, "files"),path.join(__dirname, "files-copy"));
    });
}
function copyFolders(pathFolder,pathCopyFolder){
    console.log("do copyFolder");
    fs.readdir(pathFolder, function(error,data){
        if(data){
            for(let i = 0; i < data.length; i++){
                let curPath = path.join(pathFolder,data[i]);
                let curCopyPath = path.join(pathCopyFolder,data[i]);
                console.log("curPath     " + curPath);
                console.log("CurCopyPath     " + curCopyPath);
                fs.stat(curPath, function(error,stats){
                    if(!error){
                        if(!stats.isFile()){
                            copyFolders(curPath,curCopyPath);
                            fs.mkdir(path.join(pathCopyFolder,data[i]),{recursive: true} ,(error) => {
                                console.log(error);
                            });
                        } else{
                            fs.copyFile(path.join(pathFolder,data[i]),path.join(pathCopyFolder,data[i]), (error) =>{});
                        }
                    }
                });
            }
        }
    })
}
async function deleteFolder(pathFolder){
    console.log("do deleteFolder");
    fs.readdir(pathFolder, function(error,data){
        if(data){
            for(let i = 0; i <  data.length; i++){
                let curPath = path.join(pathFolder, data[i]);
                console.log(curPath);
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