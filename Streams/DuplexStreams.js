// Applying backpresure to readable streams.
const { PassThrough } = require("stream");
const { createWriteStream, createReadStream, WriteStream } = require("fs");
const readStream = createReadStream("./streamFile.txt");
const duplexStreamFile = createWriteStream("./pipes.txt");

const duplexReport = new PassThrough();
readStream.pipe(duplexReport).pipe(duplexStreamFile); // So duplex stream represent the middle sections of pipelines

var total = 0;
duplexReport.on("data", (chunk) => {
    total += chunk.length;
    console.log("bytes ", total); //bytes passing through the stream
});