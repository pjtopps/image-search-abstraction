const express = require('express');
const app = express();

const all = require('./controllers/all');
const search = require('./controllers/imagesearch');
const history = require('./controllers/history');

let port = 3000;

console.log(`listeneing on port:${port}`);

search(app);
history(app);
all(app);

app.listen(3000);
