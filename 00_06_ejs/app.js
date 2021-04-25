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
  .get((req, res, next) => {
    try {
      res.render('all', { fruits: DATA });
    } catch (err) {
      next(err)
    }
  });

app.route('/fruits/:id')
  .get((req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const fruit = DATA.find((o) => o.id === id);
      res.render('fruits', fruit)
    } catch (err) {
      next(err)
    }
  })

app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
  console.error(err);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
