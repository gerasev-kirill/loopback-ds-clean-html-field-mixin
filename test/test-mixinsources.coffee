loopback = require('loopback')
lt = require('loopback-testing')
chai = require('chai')
expect = chai.expect
# Create a new loopback app.
app = require('./fixtures/simple-app/server/server.js')







describe 'api allowed', ->
    lt.beforeEach.withApp app


    #lt.describe.whenCalledRemotely 'GET', '/api/People', (done)->
    #    lt.it.shouldBeAllowed()


    describe 'clean html', ()->
        lt.beforeEach.givenModel('Person', {name: 'Tom', bio: 'empty'}, 'People')

        it 'should clean non-empty html field', (done)->
            @post('/api/People')
                .send({
                    name: 'Tom',
                    bio: '<p style="color:red;">Hello!!</p><div><a href="google.com" rel="bla-bla">google</a></div>'
                })
                .expect(200)
                .end (err, res)->
                    expect(res.body.bio).to.equal(
                        '<p>Hello!!</p><div><a href="google.com">google</a></div>'
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
