// Applying backpresure to readable streams.

const { createWriteStream, createReadStream, WriteStream } = require("fs");
const readStream = createReadStream("./streamFile.txt");
const copyOFStreamFile = createWriteStream("./copy.txt", {
    highWaterMark: 1, // setting the water mark
});

//stream events. data -> listens for a data event

readStream.on("data", (chunk) => {
    const result = copyOFStreamFile.write(chunk);
    if (!result) {
        console.log("this is the backpressure");
        readStream.pause();
    }
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

copyOFStreamFile.on("drain", () => {
    // once the write stream is drained, this event is fired
    console.log("draining");
    readStream.resume();
});