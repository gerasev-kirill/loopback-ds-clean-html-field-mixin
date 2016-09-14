(function() {
  var app, chai, expect, loopback, lt;

  loopback = require('loopback');

  lt = require('loopback-testing');

  chai = require('chai');

  expect = chai.expect;

  app = require('./fixtures/simple-app/server/server.js');

  describe('update object::', function() {
    lt.beforeEach.withApp(app);
    return describe('clean html', function() {
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        bio: ''
      }, 'person');
      it('should clean non-empty html field', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          bio: '<p style="color:red;">Hello!!</p><div><a href="google.com" rel="bla-bla" my-attr="invalid-val">google</a></div>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<p>Hello!!</p><div><a href="google.com" my-attr="my-val">google</a></div>');
          return done();
        });
      });
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        bio: ''
      }, 'person');
      it('should skip empty html field', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          name: 'Tom',
          bio: ''
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('');
          return done();
        });
      });
      lt.beforeEach.givenModel('Person', {
        name: 'Noname',
        bio: ''
      }, 'person');
      it('should skip undefined html field', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          name: 'Tom'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal(void 0);
          expect(res.body.name).to.equal('Tom');
          return done();
        });
      });
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        bio: ''
      }, 'person');
      it('should remove tag in non-empty html field', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          name: 'Tom',
          bio: '<p class="text-danger text-center"><my-tag>Hello</my-tag>World!</p>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<p class="text-center">World!</p>');
          return done();
        });
      });
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        bio: ''
      }, 'person');
      it('should remove class in non-empty html field by class selector', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          name: 'Tom',
          bio: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>'
        }).expect(200).end(function(err, res) {
          expect(res.body.bio).to.equal('<div class="btn">Danger</div><div class="btn btn-default">Safe<span class="btn new-class"></span></div>');
          return done();
        });
      });
      lt.beforeEach.givenModel('Person', {
        name: 'Tom',
        jsonField: {}
      }, 'person');
      it('should remove class in non-empty complex html field by class selector', function(done) {
        var person;
        person = this.person;
        return this.put("/api/People/" + person.id).send({
          name: 'Tom',
          jsonField: {
            en: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>',
            ru: '<p class="btn btn-danger">Удали мой класс</p>',
            id: 'some-id'
          }
        }).expect(200).end(function(err, res) {
          expect(res.body.jsonField.en).to.equal('<div class="btn">Danger</div><div class="btn btn-default">Safe<span class="btn new-class"></span></div>');
          expect(res.body.jsonField.ru).to.equal('<p class="btn">Удали мой класс</p>');
          expect(res.body.jsonField.id).to.equal('some-id');
          return done();
        });
      });
      lt.beforeEach.givenModel('Cat', {
        name: '',
        jsonField: {}
      }, 'cat');
      return it('should skip 2 of 3 fields in model Cat [info, weight]', function(done) {
        var cat;
        cat = this.cat;
        return this.put("/api/Cats/" + cat.id).send({
          name: 'Tom',
          info: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>',
          weight: 10,
          jsonField: {
            ru: '<p style="color:red;">Удали мой стиль</p>',
            id: 'some-id'
          }
        }).expect(200).end(function(err, res) {
          expect(res.body.weight).to.equal(10);
          expect(res.body.info).to.equal('<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>');
          expect(res.body.jsonField.ru).to.equal('<p>Удали мой стиль</p>');
          expect(res.body.jsonField.id).to.equal('some-id');
          return done();
        });
      });
    });
  });

}).call(this);
