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

app.use((req, res, next) => {
  console.log(`${req.method}${req.url}`);
  console.log(`Body ${JSON.stringify(req.body)}`)
  console.log(`Query-Params ${JSON.stringify(req.query)}`)
  console.log('------------------------------------------')
  next();
});

app.route('/names')
  .get((req, res) => res.send(DATA))
  .post((req, res) => {
    const { name, color } = req.body;
    if (DATA.some((o) => o.name === name)) {
      res.status(400);
      res.send('Duplicate name');
    } else {
      const id = Math.max(...DATA.map((o) => o.id)) + 1;
      const names = { id, name, color };
      DATA.push(names);
      res.send(names);
    }
  })

app.route('/names/:id')
  .get((req, res) => {
    const parsedId = parseInt(req.params.id);
    const found = DATA.some(char => char.id === parsedId)
    if (found) {
      res.json(DATA.filter(char => char.id === parsedId));
    } else {
      res.status(400).json({ msg: `fruit ${parsedId} not found` });
    }
  })
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const index = DATA.findIndex((o) => o.id === id);
    if (index === -1) {
      res.status(400).send('Unknown id');
    } else {
      DATA.splice(index, 1, { ...req.body, id });
      res.send();
    }
  })
  .patch((req, res) => {
    const id = parseInt(req.params.id);
    const item = DATA.find((o) => o.id === id);
    if (!item) {
      res.status(400).send('Unknown id');
    } else {
      Object.assign(item, req.body);
      res.send();
    }
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = DATA.findIndex((o) => o.id === id);
    if (index === -1) {
      res.status(400).send('Unknown id');
    } else {
      DATA.splice(index, 1);
      res.sendStatus(204);
    }
  })

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
