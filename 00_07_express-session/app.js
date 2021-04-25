const express = require('express');
const session = require('express-session');

const PORT = 3000;
const RATE_LIMIT = 100000;

const app = express();

// session middleware
app.use(session({
    secret: '<S*4_WTU]kQ}x#xN', // encode and decode cookies
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: RATE_LIMIT } // in ms
}
));

// Counter middleware
app.use((req, res, next) => {
    if (req.session.counter) {
        req.session.counter++;
        next()
    } else {
        req.session.counter = 1
        res.send('Refresh the page')
    }
});

// TODO: Rate limit middleware

// Base-Endpoint
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>count: ' + req.session.counter + '</p>')
    res.end()
})

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
