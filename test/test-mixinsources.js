(function() {
  var app, chai, expect, loopback, lt;

  loopback = require('loopback');

  lt = require('loopback-testing');

  chai = require('chai');

  expect = chai.expect;

  app = require('./fixtures/simple-app/server/server.js');

  describe('api allowed', function() {
    lt.beforeEach.withApp(app);
    return describe('clean html', function() {
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        bio: 'empty'
      }, 'People');
      it('should clean non-empty html field', function(done) {
        return this.post('/api/People').send({
          name: 'Tom',
          bio: '<p style="color:red;">Hello!!</p><div><a href="google.com" rel="bla-bla">google</a></div>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<p>Hello!!</p><div><a href="google.com">google</a></div>');
          return done();
        });
      });
      it('should skip empty html field', function(done) {
        return this.post('/api/People').send({
          name: 'Tom',
          bio: ''
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('');
          return done();
        });
      });
      it('should skip undefined html field', function(done) {
        return this.post('/api/People').send({
          name: 'Tom'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal(void 0);
          return done();
        });
      });
      it('should remove tag in non-empty html field', function(done) {
        return this.post('/api/People').send({
          name: 'Tom',
          bio: '<p class="text-danger text-center"><my-tag>Hello</my-tag>World!</p>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<p class="text-center">World!</p>');
          return done();
        });
      });
      return it('should remove class in non-empty html field by class selector', function(done) {
        return this.post('/api/People').send({
          name: 'Tom',
          bio: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<div class="btn">Danger</div><div class="btn btn-default">Safe<span class="btn new-class"></span></div>');
          return done();
        });
      });
    });
  });

}).call(this);