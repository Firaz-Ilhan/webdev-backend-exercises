const express = require('express');
const logger = require('./logger')
const app = express();

const PORT = 3000;

const fruits = [
  { id: 1, name: 'avocado' },
  { id: 2, name: 'blueberry' },
  { id: 2, name: 'peach' },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init middleware
app.use(logger);

// get all fruits
app.get('/fruits', (req, res) => res.send(fruits));

// get specific fruit
app.get('/fruits/:id', (req, res) => {

  const parsedId = parseInt(req.params.id);
  const found = fruits.some(char => char.id === parsedId)

  if (found) {
    res.json(fruits.filter(char => char.id === parsedId));
  } else {
    res.status(400).json({ msg: `fruit ${parsedId} not found` });
  }
})

// create fruit
app.post('/fruits', (req, res) => {
  const newfruit = {
    id: Math.max(...DATA.map((o) => o.id)) + 1,
    name: req.body.name
  }

  if (!newfruit.name) {
    return res.status(400).json({ mgs: 'please enter a name' })
  }

  fruits.push(newfruit);
  res.json(fruits)
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);