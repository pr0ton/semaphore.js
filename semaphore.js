
/*
 * Asynchronous Semaphore for Javascript
 */
;(function(global) {

'use strict';
/**
 * Asynchronous semaphore limits the number of asynchronous functions running at any given time.
 * Once the semaphore provides access, the semaphore function is called with a releaser.
 * The function being called must release the semaphore in some of it's callbacks
 * You can additionally specify a timeout which will release the semaphore after a certin time.
 * This is to help with cases where something might have not released the semaphore properly
 */
function Semaphore(totalSize, timeout) {
  this.totalSize = parseInt(totalSize);
  this.inUse = 0;
  this.queue = [];
  this.timeout = parseFloat(timeout);
}

/**
 * Shifts the queue of callbacks if fewer workers are using this semaphore.
 * Creates a releaser that's passed to the callback
 */
Semaphore.prototype.shiftq = function() {
  var thisArg = this;
  if (thisArg.queue.length > 0) {
    if (thisArg.inUse < thisArg.totalSize) {

      var releaser = (function() {
        var released = false;
        return function() {
          if (!released) {
            thisArg.inUse -= 1;
            released = true;
            /* Something freed up, try and see if shiftq can free up more resources */
            thisArg.shiftq();
          }
        };
      })();

      var nextCb = thisArg.queue.shift();
      thisArg.inUse += 1;
      if (thisArg.timeout) {
        setTimeout(releaser, thisArg.timeout);
      }
      return nextCb(releaser);
    }
  }
};
/**
 * Pushes a callback into the queue and calls shiftq to check if any callbacks can be executed
 */
Semaphore.prototype.acquire = function(cb) {
  this.queue.push(cb);
  this.shiftq();
};


/**
 * Expose `Async Semaphore`
 */
if (typeof exports === 'object') {
  // node export
  module.exports = Semaphore;
} else if (typeof define === 'function' && define.amd) {
  // amd export
  define(function () {
      return Semaphore;
  });
} else {
 // browser global
  global.Semaphore = Semaphore;
}
})(this);



