// replace the typed in character

const { Transform } = require("stream");
const { callbackify } = require("util");

class ReplaceText extends Transform {
    constructor(char) {
        super();
        this.replaceChar = char;
    }

    _transform(chunk, enconding, cb) {
        const transformChunk = chunk
            .toString()
            .replace(/[a-z]|[A-Z]|[0 - 9]/g, this.replaceChar);
        this.push(transformChunk);
        cb();
    }

    _flash(cb) {
        this.push("more chunk transformed is passed..");
        callbackify();
    }
}

var Ystream = new ReplaceText("Y");
process.stdin.pipe(Ystream).pipe(process.stdout);