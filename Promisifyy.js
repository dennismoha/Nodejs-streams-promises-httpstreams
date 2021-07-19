/* THIS MODULE SHOWS HOW TO DEAL WITH PROMISES IN NODE
   EACH SECTION DEPICTS A CERTAIN SPECIFIC THING WHICH ARE :
    1) SEQUENTIAL EXECUTION
    2) PARALLEL EXECUTION . PROMISE.ALL() && PROMISE.RACE()
    3) CONCURRENT EXECUTION 
*/

const { promisify } = require("util");
var fs = require("fs");

const readdir = promisify(fs.readdir);
const beep = () => process.stdout.write("\x07");
const delay = (seconds) =>
    new Promise((resolve) => {
        setTimeout(resolve, seconds * 50);
    });
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const logUpdate = require("log-update");
const toX = () => "X";

/* ======================================= SECTION 1. ===============================
                                    CONVERTING A FUNCTION TO A PROMISE USING PROMISIFY */
/*

const functionDelay = (seconds, cb) => {
    if (seconds < 3) {
        cb(new Error("seconds too much"));
    }
    setTimeout(() => {
        cb(null, "awesome!");
    }, seconds);
};

// converting the above function to a promise

const functionPromiseDelay = promisify(functionDelay);
const n = 2;
functionPromiseDelay(n)
    .then(() => console.log("seconds less than ", n))
    .catch((error) => console.log(error.message));
*/
// ==== ================================END OF SECTION 1 ==============

// ============================================== SECTION 2 ===============================
// ===                                  PROMISE.ALL - returns a  single promise

// Promise.all([
//         writeFile("text.txt", "this is the first text"),
//         writeFile("reaadme.md", "this is the first text"),
//         writeFile("text.json", '{"message":"this is the first text"}'),
//     ])
//     .then(() => readDir(__dirname))
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error.message));

//  =================================== END OF SECTION 2 ============================

/* == ===================================== SECTION 3
   PROMISE.RACE = GIVES US A WAY OF EXECUTING PROMISES IN PARALLEL. 
        DOESN'T HAVE TO WAIT FOR ALL PROMISES TO RESOLVE BEFORE IT RETURNS.
        link : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
   */

/*Promise.race([delay(1), delay(2), delay(3), delay(4)])
    .then(() => readDir(__dirname))
    .then(console.log)
    .catch((error) => console.log(error.message)); */

// THE ABOVE RETURNS IMMEDIATELY THE FIRST PROMISE IS RESOLVED
// ================================== END OF SECTION 3 ========================================================

/*
    =============================== SECTION 4 ==========================

    ================ CONCURRENT TASK QUEUE ===================

    SCENARIO : IN  A SCENARIO WHERE SOME PROMISES CONSISTS OF LARGE TASKS THAT CONSUME ALOT OF SYSTEM RESOURCES 
    OR TAKE TO MUCH TIME TO RUN THAN THE REST, IT WOULD BE COSTLY TO RUN EVERYTHING AT ONCE.AND IN SUCH CASES
    RUNNING EACH PROMISE AT A TIME CAN BE THE SOLUTION AND THAT'S WHERE CONCURRENT PROMISES COME IN 


*/

const taskPromises = [
    // delay creates a number of promises that will delay for a number of seconds
    delay(4),
    delay(5),
    delay(9),
    delay(3),
    delay(2),
    delay(1),
    delay(7),
];

class PromiseQue {
    constructor(promises = [], tasksPerTime = 1) {
        this.taskPerTimes = tasksPerTime;
        this.totalOfPromises = promises.length;
        this.todo = promises; // promises we need to do
        this.running = [];
        this.complete = [];
    }

    get runAnotherTask() {
        // tells us if it's time to run another task
        return this.running.length < this.taskPerTimes && this.todo.length;
    }

    graphTasks() {
        const { todo, running, complete } = this;
        logUpdate(`
            todo:[${todo.map(toX)}]
            running:[${running.map(toX)}]
            complete:[${complete.map(toX)}]
        `);
    }
    run() {
        while (this.runAnotherTask) {
            //remove the promise from todo, add it to running, once complete push it to complete and remove it from running
            const promise = this.todo.shift(); //removes the promise on todo list and assigns it to this variable
            promise.then(() => {
                this.complete.push(this.running.shift()); // this.runnng.shift removes it from todo
                this.graphTasks();
                this.run(); // invoked once the promise is complete
            });
            this.running.push(promise);
            this.graphTasks();
        }
    }
}

const delayQue = new PromiseQue(taskPromises, 2); // Args: tasks to execute and how many tasks at a time
delayQue.run();
//======================= END OF CONCURRENT TASK QUEUE =========================