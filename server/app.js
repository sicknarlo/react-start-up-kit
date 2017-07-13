/* eslint-env node */
const express = require('express');
const path = require('path');
const layouts = require('express-ejs-layouts');
const compress = require('compression');

require('ejs');

const app = express();
const port = process.env.PORT || 8000;

app.set('views', './server/views');
app.set('view engine', 'ejs');

app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.get('/browsers', function (req, res) {
    res.json([
        { text: 'Chrome', value: 'CH' },
        { text: 'Firefox', value: 'FF' },
        { text: 'Internet Explorer', value: 'IE' },
        { text: 'Microsoft Edge', value: 'TR' },
        { text: 'Opera', value: 'OP' },
        { text: 'Safari', value: 'SF' },
    ]);
});

app.get('/*', function (req, res) {
    res.render('index');
});

const server = app.listen(port, function () {
    /* eslint-disable no-console */
    console.log('Frontend scaffold launched http://%s:%s, Ctrl+C to Stop', server.address().address, server.address().port);
    /* eslint-enable no-console */
});
