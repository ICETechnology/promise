(function() {

  'use strict';

  var Promise = function() {
    var resolver;
    this.thenTargets = [];
    this.pending = true;
  };

  var isPromise = function(promise) {
    return promise && promise instanceof Promise;
  };

  var isPseudoPromise = function(promise) {
    return promise && typeof promise.then == 'function';
  };

  Promise.prototype.resolve = function(promise, value) {
    if (promise === value) {
      throw new TypeError('resolve: arguments cannot be the same object');
    }
    if (isPromise(value) || isPseudoPromise(value)) {
      value.then(promise.fulfil.bind(promise), promise.reject.bind(promise));
    } else {
      promise.fulfil.apply(promise, [].slice.call(arguments, 1));
    }
  };

  Promise.prototype.handleThenTargets = function() {
    var callbackResult;
    var callback;
    var value;
    var i;

    for (i = 0; i < this.thenTargets.length; ++i) {
      if (this.fulfilled) {
        callback = this.thenTargets[i].onFulfilled;
        value = this.value;
      }
      if (this.rejected) {
        callback = this.thenTargets[i].onRejected;
        value = this.reason;
      }
      try {
        if (callback && typeof callback === 'function') {
          callbackResult = callback.call(undefined, value);
        } else {
          callbackResult = this;
        }

        if (this.fulfilled) {
          this.resolve(this.thenTargets[i], callbackResult);
        }

        if (this.rejected) {
          this.thenTargets[i].reject(callbackResult);
        }

      } catch (err) {
        this.thenTargets[i].reject(err);
      }
    }
    this.thenTargets = [];
  };

  Promise.prototype.handleThen = function() {
    if (!this.pending) {
      this.handleThenTargets();
    }
  };

  Promise.prototype.then = function(onFulfilled, onRejected) {
    var thenResult = new Promise();
    // The execution of then is asynchronous so we need to have this info available later.
    thenResult.onFulfilled = onFulfilled;
    thenResult.onRejected = onRejected;
    this.thenTargets.push(thenResult);
    setTimeout(this.handleThen.bind(this), 0);
    return thenResult;
  };

  Promise.prototype.fulfil = Promise.prototype.fulfill = function(value) {
    var i;
    var linkedPromise;
    if (this.rejected) {
      return;
    }
    this.fulfilled = true;
    this.pending = false;
    this.value = value;
    this.handleThenTargets();
  };

  Promise.prototype.reject = function(value) {
    var i;
    var linkedPromise;
    if (this.fulfilled) {
      return;
    }
    this.rejected = true;
    this.pending = false;
    this.reason = value;
    this.handleThenTargets();
  };

  Promise.prototype.abort = function() {
    this.reject('abort');
  };

  this.Promise = Promise;

}).call(this);