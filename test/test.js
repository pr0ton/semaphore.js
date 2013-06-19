var assert = require("assert"),
    Semaphore = require("../semaphore"),
    events = require('events');
describe('Semaphore', function(){
  
  function createWorkers(sem, count, eventCb) {
    var workerReleasers = [];
    for (var i=0; i < count; i++) {
      (function(i) {
        var emitter = new events.EventEmitter();
        workerReleasers.push(function() {
          emitter.emit('release');
        });
        sem.acquire(function(r) {
          eventCb("a" + i);
          return emitter.on('release', function() {
             eventCb("r" + i);
             return r();
          });
        });
      })(i);
    }
    return function(x) {
      workerReleasers[x]();
    };
  };
  
  describe('normal semaphore behaviour', function() {
    var sem = new Semaphore(1);
    var q = [];
    var release = createWorkers(sem, 2, function(index) {
      q.push(index);
    });
    /* Release order for this test */
    [0, 1].forEach(function(i) {
      release(i);
    });
    it ('should acquire semaphore in right order', function() {
      assert.deepEqual(q, ["a0","r0","a1","r1"]);
    });
  });
  
  describe('semaphore deadlock behaviour', function() {
    var sem = new Semaphore(1);
    var q = [];
    var release = createWorkers(sem, 2, function(index) {
      q.push(index);
    });
    /* Release order for this test */
    [1, 0].forEach(function(i) {
      release(i);
    });
    it ('should get into deadlock', function() {
      /* Deadlock happens because 1 triggers their releaser before it's actually acquired and registered */
      assert.deepEqual(q, ["a0","r0","a1"]);
    });
  });
  
  describe('semaphore out of order execution', function() {
    var sem = new Semaphore(2);
    var q = [];
    var release = createWorkers(sem, 3, function(index) {
      q.push(index);
    });
    /* Release order for this test */
    [1, 2, 0].forEach(function(i) {
      release(i);
    });
    it ('should get into deadlock', function() {
      /* 0 releases at the end, but since 1 frees up a slot, 2 and 3 can proceed */
      assert.deepEqual(q, ["a0","a1","r1","a2","r2","r0"]);
    });
  });
  
  
  
});
