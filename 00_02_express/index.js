const express = require('express');
const app = express();

app.use('/static', express.static(__dirname + '/files'));

app.listen(3000)

const format = s => `\x1b[1;4;5;33;45m${s}\x1b[0m`

console.log(format("static express server running on port 3000 ..."));
