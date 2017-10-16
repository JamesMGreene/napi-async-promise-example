// Userland modules
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

// Local modules
var addon = require('../');


// Local variales
var expect = chai.expect;


chai.use(chaiAsPromised);



describe('addon', function() {

  it('should have all expected keys', function() {
    expect(addon).to.contain.all.keys(['add']);
  });


  describe('.add', function() {

    it('should be a function', function() {
      expect(addon.add).to.be.a('function');
    });

    it('should expect 2 parameters', function() {
      return Promise
        .all([
          expect(addon.add()).to.be.rejectedWith(TypeError, 'Invalid argument count'),
          expect(addon.add(1)).to.be.rejectedWith(TypeError, 'Invalid argument count'),
          expect(addon.add(1, 2, function() {})).to.be.rejectedWith(TypeError, 'Invalid argument count')
        ]);
    });

    it('should reject the Promise asynchronously for invalid argument count', function(done) {
      // Arrange
      var step = 0;

      // Act
      // Invalid argument count
      var result = addon.add();
      result
        .then(function( /* sum */ ) {
          // Assert more
          done(new Error('Should not have invoked the resolve handler'));
        })
        .catch(function(err) {
          // Assert more
          expect(err).to.be.an.instanceOf(TypeError);
          expect(err.message).to.equal('Invalid argument count');
          expect(step).to.equal(1);
          done();
        });

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should expect valid parameters', function() {
      return Promise
        .all([
          // Invalid param 1
          expect(addon.add('a', 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(false, 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(true, 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add({}, 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add([], 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add([1], 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(() => { 1 }, 2)).to.be.rejectedWith(TypeError, 'Invalid argument types'),

          // Invalid param 2
          expect(addon.add(1, 'b')).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, false)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, true)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, {})).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, [])).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, [2])).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(1, () => { 2 })).to.be.rejectedWith(TypeError, 'Invalid argument types'),

          // Invalid params 1 + 2
          expect(addon.add('a', 'b')).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(false, false)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(true, true)).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add({}, {})).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add([], [])).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add([1], [2])).to.be.rejectedWith(TypeError, 'Invalid argument types'),
          expect(addon.add(() => { 1 }, () => { 2 })).to.be.rejectedWith(TypeError, 'Invalid argument types')
        ]);
    });

    it('should reject the Promise asynchronously for invalid argument types', function(done) {
      // Arrange
      var step = 0;

      // Act
      // Invalid argument types
      var result = addon.add('a', 1);
      result
        .then(function( /* sum */ ) {
          // Assert more
          done(new Error('Should not have invoked the resolve handler'));
        })
        .catch(function(err) {
          // Assert more
          expect(err).to.be.an.instanceOf(TypeError);
          expect(err.message).to.equal('Invalid argument types');
          expect(step).to.equal(1);
          done();
        });

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should return a Promise', function(done) {
      var result = addon.add(1, 2);
      expect(result).to.be.a('promise');
      result
        .then(function( /* sum */ ) { done(); })
        .catch(function( /* err */ ) { done(); });
    });

    it('should eventually resolve the Promise', function() {
      var result = addon.add(1, 2);
      return expect(result).to.eventually.equal(3);
    });

    it('should resolve the Promise asynchronously', function(done) {
      // Arrange
      var step = 0;

      // Act
      var result = addon.add(1, 2);
      result
        .then(function(sum) {
          // Assert more
          expect(sum).to.equal(3);
          expect(step).to.equal(1);
          done();
        })
        .catch(done);

      // Assert
      expect(step).to.equal(0);
      step++;
    });

    it('should add numbers together', function() {
      return Promise
        .all([
          // zeroes
          expect(addon.add(0, 0)).to.eventually.equal(0),

          // zeroes + positives
          expect(addon.add(0, 1)).to.eventually.equal(1),
          expect(addon.add(1, 0)).to.eventually.equal(1),

          // zeroes + negatives
          expect(addon.add(0, -1)).to.eventually.equal(-1),
          expect(addon.add(-1, 0)).to.eventually.equal(-1),

          // positives
          expect(addon.add(2, 3)).to.eventually.equal(5),
          expect(addon.add(3, 2)).to.eventually.equal(5),

          // negatives
          expect(addon.add(-2, -3)).to.eventually.equal(-5),
          expect(addon.add(-3, -2)).to.eventually.equal(-5),

          // postives + negatives
          expect(addon.add(2, -3)).to.eventually.equal(-1),
          expect(addon.add(-3, 2)).to.eventually.equal(-1),
          expect(addon.add(-2, 3)).to.eventually.equal(1),
          expect(addon.add(3, -2)).to.eventually.equal(1)
        ]);
    });

  });

});
