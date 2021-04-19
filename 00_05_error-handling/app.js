const express = require('express');

const PORT = 3000;
const DATA = [
  { id: 1, name: 'avocado', color: 'green' },
  { id: 2, name: 'blueberry', color: 'blue' },
  { id: 3, name: 'peach', color: 'peach' },
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route('/fruits')
  .get((req, res, next) => {
    try {
      res.send(DATA);
    } catch (err) {
      next(err);
    }
  });

app.route('/fruits/:id')
  .get((req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const item = DATA.find((o) => o.id === id);
      res.send({ name: item.name, color: item.color });
    } catch (err) {
      next(err);
    }
  });

// 404-Handler
app.use((req, res) => {
  res.status(404).send('400: Not found');
});

// Error-Middleware
app.use((err, req, res, next) => { // four arguments necessary
  res.status(500).send('Internal Server Error');
  console.error(err);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
