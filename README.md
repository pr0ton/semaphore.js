# semaphore.js

Asynchronous semaphore for Javascript


## Installation

Install with [Bower](http://bower.io):

```
bower install --save semaphore.js
```

The component can be used as a Common JS module, an AMD module, or a global.


## API

### Initialization

Simple semaphore creation
```js
/* Creates a semaphore of size 3*/
var sem = new Semaphore(3);
```

Semaphore creation with timeout, if calling function doesn't release
within timeout
```js
/* Creates a semaphore of size 2, and if the calling function doesn't
release, auto-releases in 100 ms*/
var sem = new Semaphore(2, 100);
```

### Acquiring and releasing semaphore

The acquire method takes in a function that has a release method with it.
The release method releases the semaphore the first time it is invoked.
Subsequent invocations have no effect (they do not create extra
semaphore capacity).

```js
var sem = new Semaphore(2, 100);
sem.acquire(function(release) {
  // do stuff
  // release after 50 ms
  console.log("first callback acquiring");
  setTimeout(function() {
      console.log("first callback releasing");
      release();
      release(); // only the first invocation matters
  }, 150);
});

sem.acquire(function(release) {
  console.log("first callback acquiring");
  setTimeout(function() {
      console.log("first callback releasing");
      release();
  }, 1);
});
```

Look at example.js for a demo. You can run it as

```
node example.js
```
