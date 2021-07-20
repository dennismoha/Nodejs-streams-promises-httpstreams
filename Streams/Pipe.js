// Applying backpresure to readable streams.

const { createWriteStream, createReadStream, WriteStream } = require("fs");
const readStream = createReadStream("./streamFile.txt");
const copyOFStreamFile = createWriteStream("./pipes.txt");

readStream.pipe(copyOFStreamFile).on("error", (error) => {
    console.log(error);
});