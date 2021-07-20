# NODEJS PROMISES , STREAMS AND PIPES AND HTTP STREAMS EXERCISES
### This is my coursework Assignments .

# STREAMS 
    1. Writeable streams
    2. Readable Streams
    3. Handling Streams backpressure 
    4. Piping Streams
    5. Duplex Streams
    6. Transform Streams
    7. Video Streaming project.

#### 3. Backpressure.
    In scenarios where the amount of data coming in is more than the writestream can handle, we call that backpressure.

    Backpressure  will pause the incoming Readable stream from sending any data and wait until the consumer is ready again.
    Once the data buffer is emptied, a 'drain' event will be emitted and resume the incoming data flow. Once the queue is finished, backpressure will allow data to be sent again.
    The writestream returns a true or false value as to whether it can handle more data.
    if the result is false, we need to pause the readstream or tell it not to pout more data untill the host remains.
    We set the ** HIGH WATER MARK ** to decide how thick our hose are.

#### 4. Pipping Streams.
    pipe stream automatically handles back pressure for us and reduces all the code to do with events as seen above.
    The only thing we handle is error using the error event.
    Any readstream can be piped to any write stream

#### 5. Duplex Stream
    A duplex stream is a stream that implements both a readable and a writable. These streams allow data to pass through.Readable streams will pipe data into a duplex stream,and the duplex stream can also write that data.
    So duplex stream represent the middle sections of pipelines. So duplex streams help us compose streams into pipelines.

    ```javascript
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
    ```

##### Duplex stream Throttle



#### 6. TRANSFORM STREAMS.
     Transform streams are a special type of duplex stream. Instead of simply passing the data to the read in
     to the write in, transform streams change the data.Transform streams are the center pipe pieces that can be used to transform data
     from readable streams before they are sent to writable streams.

     Example: This is an example of transforming input streaams 
     `
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
        `
#### 7. HTTP STREAMING. VIDEO STREAMING.
  ```javascript
        router.get('/videos',(req,res,next) => {
  const paths = path.dirname(process.mainModule.filename )
  const paths2 = path.join(paths ,'/Files/')
  
  const filePath  =  path.join(paths ,'Files/Sat Feb 27 2021-10 sentences which changed Cristiano Ronaldo\'s life _ Oh My Goal.mp4');
  if(!fs.existsSync(filePath)){
   return res.status(404).json({message: 'file not found'})
  }

  const fileSize = fs.statSync(filePath).size;
  const range  = req.headers.range

  if(range) {
    let parts = range.replace(/bytes=/,"").split('-')
    let start  = parseInt(parts[0],10);
    let end = parts[1] ? parseInt(parts[1],10):fileSize - 1
    let CHUNK_SIZE = end - start + 1;
    let fille = fs.createReadStream(filePath,{start,end});
    
    const headers = {
            "Content-Range" :`bytes ${start} - ${end}/${fileSize}`,
            "Accept-Ranges" : "bytes",
            "Content-Length" :CHUNK_SIZE,
            "Content-type" :"video/mp4"
          };
          res.writeHead(206, headers)


          fille.pipe(res)
          fille.on('end',(error)=>{
           return next(new Error('file end'))
          })

  }else {
    const head =  {
      'Content-Length' :fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res)
  }

}) ```
