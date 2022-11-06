const fs = require("fs");
const path = require("path");
let writeStream = new fs.createWriteStream(path.join(__dirname, "text.txt"));
const { stdin, stdout } = process;
process.on("exit", () => {
    stdout.write("\nGoodbye, sir!\n");
});
process.on('SIGINT', () => {
    process.exit();
});
stdout.write("Hello, sir! Enter the data in thefile\n");
stdin.on("data", data => {
    if (data.toString().trim() == "exit") {
        process.exit();
    }
    writeStream.write(data);
})
