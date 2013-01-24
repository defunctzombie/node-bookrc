var log = require('book').default();

log.use(function() {
    this.foo = 'bar';
});

module.exports = log;
