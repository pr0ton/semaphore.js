var Semaphore = require('./semaphore');
/* Testing code */

var s = new Semaphore(2);
var startTime = new Date().getTime();
function elapsedTime() {
  return (new Date().getTime() - startTime) / 1000. + " seconds";
}
function getWorker(num, workTime) {
  return function(release) {

    console.log("++++ " + num + "\tElapsed: " + elapsedTime());
    setTimeout(function() {
      console.log("---- " + num + "\tElapsed: " + elapsedTime());
      release();
    }, workTime);
  };
}

s.acquire(getWorker(1, 3000));
s.acquire(getWorker(2, 1000));
s.acquire(getWorker(3, 1000));
s.acquire(getWorker(4, 900));
s.acquire(getWorker(5, 300));
s.acquire(getWorker(6, 300));
