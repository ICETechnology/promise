describe('Basic Test', function() {
  var promise = new Promise();

  it('should have Promise function', function() {
    expect(Promise).toBeFunction();
  });

  it('should have then function', function() {
    expect(promise.then).toBeFunction();
  });

  it('should have resolve function', function() {
    expect(promise.resolve).toBeFunction();
  });

  it('should have reject function', function() {
    expect(promise.reject).toBeFunction();
  });

  it('should have abort function', function() {
    expect(promise.abort).toBeFunction();
  });
});

describe('initial state test', function() {
  var promise = new Promise();

  it('fulfilled should be falsy', function() {
    expect(promise.fulfilled).toBeFalsy();
  });

  it('rejected should be falsy', function() {
    expect(promise.rejected).toBeFalsy();
  });

  it('pending should be true', function() {
    expect(promise.pending).toBeTrue();
  });

  it('then handler should be empty array', function() {
    expect(promise.thenTargets).toBeEmptyArray();
  });

});

describe('resolve test', function() {
  var promise = new Promise();
  promise.resolve(promise, ['', '1']);

  it('fulfilled should be true', function() {
    expect(promise.fulfilled).toBeTrue();
  });

  it('pending should be false', function() {
    expect(promise.pending).toBeFalse();
  });

  it('rejected should be falsy', function() {
    expect(promise.rejected).toBeFalsy();
  });

  it('resolve value should be equal to argument', function() {
    expect(promise.value).toEqual(['', '1']);
  });
});

describe('reject test', function() {
  var promise = new Promise();
  promise.reject(['fail', 'fail2']);

  it('fulfilled should be true', function() {
    expect(promise.fulfilled).toBeFalsy();
  });

  it('pending should be false', function() {
    expect(promise.pending).toBeFalse();
  });

  it('rejected should be falsy', function() {
    expect(promise.rejected).toBeTrue();
  });

  it('reject reason should be equal to arguments', function() {
    expect(promise.reason).toEqual(['fail', 'fail2']);
  });
});

describe('then test', function() {
  it('should return new promise when call then', function() {
    expect(new Promise().then() instanceof Promise).toBeTrue();
  });

  it('should add success function at onFulfilled', function() {
    var emptyfunction = function () {};
    var promise = new Promise().then(emptyfunction);
    expect(promise.onFulfilled).toEqual(emptyfunction);
  });

  it('should add fail function at onRejected', function() {
    var emptyfunction = function () {};
    var promise = new Promise().then(null, emptyfunction);
    expect(promise.onRejected).toEqual(emptyfunction);
  });

  it('should add new promise to thenTargets array', function() {
    var promise = new Promise();
    var thenPromise = promise.then();
    expect(thenPromise).toEqual(promise.thenTargets[0]);
  });
});

describe('resolve then chain test', function() {

  it('should call all callback', function(done) {
    var promise = new Promise();
    var spy = sinon.spy();

    promise
      .then(spy)
      .then(spy)
      .then(spy);

    promise.resolve(promise);

    setTimeout(function() {
      expect(spy).toHaveBeenCalledThrice();
      done();
    }, 0);
  });

  it('should return previous result', function(done) {
    var promise = new Promise();

    promise
      .then(function (value) {
        expect(value).toBe(1);
        return value + 1;
      })
      .then(function (value) {
        expect(value).toBe(2);
        return value + 1;
      })
      .then(function (value) {
        expect(value).toBe(3);
        return value + 1;
      })
      .then(function (value) {
        expect(value).toBe(4);
        done();
      });

    promise.resolve(promise, 1);
  });

});

describe('reject then chain test', function() {

  it('should call all callback', function(done) {
    var promise = new Promise();
    var spy = sinon.spy();

    promise
      .then(null, spy)
      .then(null, spy)
      .then(null, spy);

    promise.reject();

    setTimeout(function() {
      expect(spy).toHaveBeenCalledThrice();
      done();
    }, 0);
  });

  it('should return previous result', function(done) {
    var promise = new Promise();

    promise
      .then(null, function (value) {
        expect(value).toBe(1);
        return value + 1;
      })
      .then(null, function (value) {
        expect(value).toBe(2);
        return value + 1;
      })
      .then(null, function (value) {
        expect(value).toBe(3);
        return value + 1;
      })
      .then(null, function (value) {
        expect(value).toBe(4);
        done();
      });

    promise.reject(1);
  });

});

describe('abort test', function() {
  var promise = new Promise();
  promise.abort();

  it('fulfilled should be true', function() {
    expect(promise.fulfilled).toBeFalsy();
  });

  it('pending should be false', function() {
    expect(promise.pending).toBeFalse();
  });

  it('rejected should be falsy', function() {
    expect(promise.rejected).toBeTrue();
  });

  it('resolve value should be equal to argument', function() {
    expect(promise.reason).toEqual('abort');
  });
});

