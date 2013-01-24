# bookrc

automatically load book logging configuration from your environment or valid bookrc.js files.

bookrc allows you to configure your book logging in one place for your project. It follows a simple lookup pattern and returns either your `bookrc.js` file or the default `book` module.

## use

Lets say we have application code which wants to do some logging and we want the logging to be sent to various locations and processed through the book middleware stack.

In the root of our app, we would create a `bookrc.js` file which can setup additional middleware and logging features.

```javascript
var log = require('book').default();
var raven = require('book-raven');
var git = require('book-git');

// we want to add a .commit field to our log entry with the git commit hash
log.use(git(__dirname));

// we want to log errors to raven
log.use(raven(process.env.SENTRY_DSN));

// now we just expose the logging object
module.exports = log;
```

Now we just `require('bookrc')` and use it like we used `book` before. Except now our logs will run through our middleware stack and be tagged with our commit id and send to sentry for alerting.

Our app code does not have to change much at all. Simply update `require('book')` to `require('bookrc')` and you are set.

```javascript
// instead of require('book'), use require('bookrc');
var log = require('bookrc');

// now you can just log as before, no other changes
log.info('foo');
log.error('bar');
```

## BOOK_RC env variable

If bookrc.js does not exist in the root of your project, or bookrc cannot find it. You can specify it manually using the `BOOK_RC` environment variable. Set the variable to the absolute location of the bookrc.js file and bookrc will load that instead of searching.

## install

Bookrc does not depend on book and vice versa. You must install both to have logging functionality. Bookrc is simply a dynamic loader for the bookrc.js file in your project.

```shell
npm install bookrc
npm install book
```
