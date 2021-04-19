const express = require('express');

const PORT = 3000;
const DATA = [
  { id: 1, name: 'avocado', color: 'green' },
  { id: 2, name: 'blueberry', color: 'blue' },
  { id: 3, name: 'peach', color: 'peach' },
];

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.route('/fruits')
  .get((req, res) => {
    res.render('all', { fruits: DATA });
  });

app.route('/fruits/:id')
  .get((req, res) => {
    const id = parseInt(req.params.id);
    const fruit = DATA.find((o) => o.id === id);

    res.render('fruits', fruit)
  })

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
