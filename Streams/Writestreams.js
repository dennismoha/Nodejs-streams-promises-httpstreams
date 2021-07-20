// readstreams - designed to read chunks of data at a time
// writeStreams - designed to write chunks of data at a time.
const { createWriteStream, createReadStream, WriteStream } = require("fs");
const readStream = createReadStream("./streamFile.txt");
const copyOFStreamFile = createWriteStream("./copy.txt");

//stream events. data -> listens for a data event

readStream.on("data", (chunk) => {
    copyOFStreamFile.write(chunk); // write each chunk to this file
});

// error event listens on errors
readStream.on("error", (error) => {
    console.log("Error occured ", error);
});

// End Event tells that the stream is over
readStream.on("end", () => {
    copyOFStreamFile.end(); // end the end stream once the readstream finishes
    console.log("finished read streams");
});