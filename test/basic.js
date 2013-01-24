var assert = require('assert');

function clear_cache() {
    Object.keys(require.cache).forEach(function(key) {
        delete require.cache[key];
    });
}

test('load rc file by env name', function(done) {
    clear_cache();

    process.env.BOOK_RC = __dirname + '/bookrc.js';
    var log = require('../');

    // our rc file setup some middleware to inject foo
    log.use(function() {
        assert.equal(this.foo, 'bar');
        done();
    });

    log.info('baz');
});

test('make sure no rc file is loaded', function(done) {
    clear_cache();

    process.env.BOOK_RC = 'false';
    var log = require('../');

    // our rc file setup some middleware to inject foo
    log.use(function() {
        assert.equal(this.foo, undefined);
        done();
    });

    log.info('baz');
});
