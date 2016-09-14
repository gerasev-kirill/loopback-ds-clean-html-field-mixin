loopback = require('loopback')
lt = require('loopback-testing')
chai = require('chai')
expect = chai.expect
# Create a new loopback app.
app = require('./fixtures/simple-app/server/server.js')







describe 'create object::', ->
    lt.beforeEach.withApp app


    describe 'clean html', ()->

        it 'should clean non-empty html field', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    bio: '<p style="color:red;">Hello!!</p><div><a href="google.com" rel="bla-bla" my-attr="invalid-val">google</a></div>'
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal(
                        '<p>Hello!!</p><div><a href="google.com" my-attr="my-val">google</a></div>'
                    )
                    done()

        it 'should skip empty html field', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    bio: ''
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal('')
                    done()

        it 'should skip undefined html field', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom'
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal(undefined)
                    done()

        it 'should remove tag in non-empty html field', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    bio: '<p class="text-danger text-center"><my-tag>Hello</my-tag>World!</p>'
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal('<p class="text-center">World!</p>')
                    done()

        it 'should remove class in non-empty html field by class selector', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    bio: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>'
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal(
                        '<div class="btn">Danger</div><div class="btn btn-default">Safe<span class="btn new-class"></span></div>'
                    )
                    done()

        it 'should remove class in non-empty complex html field by class selector', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    jsonField: {
                        en: '<div class="btn btn-danger">Danger</div><div class="btn btn-default">Safe<span class="btn replace-me"></span></div>',
                        ru: '<p class="btn btn-danger">Удали мой класс</p>'
                        id: 'some-id'
                    }
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.jsonField.en).to.equal(
                        '<div class="btn">Danger</div><div class="btn btn-default">Safe<span class="btn new-class"></span></div>'
                    )
                    expect(res.body.jsonField.ru).to.equal(
                        '<p class="btn">Удали мой класс</p>'
                    )
                    expect(res.body.jsonField.id).to.equal(
                        'some-id'
                    )
                    done()
