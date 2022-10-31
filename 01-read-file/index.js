const fs = require("fs");
fs.readFile("01-read-file/text.txt", "utf-8", 
    function(error,data){
        console.log(error);
        if(error) throw error;
        console.log(data);
        return data;
});