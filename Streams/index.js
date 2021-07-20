const fs = require("fs");
const readStream = fs.createReadStream("./streamFile.txt");

//stream events. data -> listens for a data event

// readStream.on("data", (chunk) => {
//     console.log("read chunks ", chunk, "size of each chunk", chunk.length);
// });

// this stream is a non flowing stream since , in order to get data from the stream  you have to request b.
readStream.pause();
process.stdin.on("data", (chunk) => {
    console.log("one chunk of data at a time", chunk);
    if (chunk.toString().trim() === "finish") {
        readStream.resume(); // this removes the stream from a non-flowing stream to a flowing stream.type fnish on consonle.
    }
});

// error event listens on errors
readStream.on("error", (error) => {
    console.log("Error occured ", error);
});

// End Event tells that the stream is over
readStream.on("end", () => {
    console.log("finished read streams");
});