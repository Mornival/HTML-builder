const fs = require("fs");
let writeStream = new fs.createWriteStream("02-write-file/text.txt");
const { stdin, stdout } = process;
process.on("exit", () => {
    stdout.write("Goodbye, sir!\n");
});
process.on('SIGINT', () => {
    process.exit();
});
stdout.write("Hello, sir!\n");
stdin.on("data", data => {
    if (data.toString().trim() == 'exit') {
        process.exit();
    }
    writeStream.write(data);
})
