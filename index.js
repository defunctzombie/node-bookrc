// builtin
var path = require('path');
var fs = require('fs');

// return a list of possible paths for bookrc.js files from `start`
function bookrc_paths(start) {
    var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\/+/;
    var parts = start.split(splitRe);

    var dirs = [];
    for (var i = parts.length - 1; i >= 0; i--) {
        if (parts[i] === 'bookrc.js') {
            continue;
        }
        var dir = path.join(
            path.join.apply(path, parts.slice(0, i + 1)),
            'bookrc.js'
        );
        if (!parts[0].match(/([A-Za-z]:)/)) {
            dir = '/' + dir;
        }
        dirs.push(dir);
    }
    return dirs;
}

function use_bookrc() {
    var bookrc = process.env.BOOK_RC;
    return !(bookrc === 'false' || bookrc === '0')
}

// if bookrc loading is disabled
// just return regular book module
if (!use_bookrc()) {
    module.exports = require('book').default();
    return;
}

var bookrc_path = process.env.BOOK_RC;

// just load the bookrc path user specified
if (bookrc_path) {
    module.exports = require(bookrc_path);
    return;
}

// try to find a suitable bookrc
var parent = module.parent;
while (parent.parent) {
    parent = parent.parent;
}
var start_path = parent.paths.shift();
var paths = bookrc_paths(start_path);

for (var i=0 ; i<paths.length ; ++i) {
    var pth = paths[i];
    if (!fs.existsSync(pth)) {
        continue;
    }

    // load and return the bookrc
    module.exports = require(pth);
    return;
}

// if no bookrc, then just return book
module.exports = require('book').default();

