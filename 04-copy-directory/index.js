const fs = require("fs");
const path = require("path");
copyDir();
async function copyDir(){
    deleteFolder(path.join(__dirname,"files-copy"), (error) => {});
}
function createFolder(){
    fs.mkdir(path.join(__dirname, "files-copy"),{recursive: true} ,(error) => {
        copyFolder(path.join(__dirname, "files"),path.join(__dirname, "files-copy"));
    });
}
function copyFolder(pathFolder,pathCopyFolder){
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