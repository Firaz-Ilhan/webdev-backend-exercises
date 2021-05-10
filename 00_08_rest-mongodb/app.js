const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

const PORT = 3100;
const DATA = [
  { id: 1, name: 'avocado', color: 'green' },
  { id: 2, name: 'blueberry', color: 'blue' },
  { id: 3, name: 'peach', color: 'peach' },
];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let db = null;
const url = `mongodb://localhost:27017`;
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((connection) => {
  db = connection.db('food');
  console.log('connected to database food ...');
});

app.post('/init-db', async (req, res, next) => {
  try {
    await db.collection('fruits').insertMany(DATA);
    res.send(`Fruits inserted`);
  } catch (err) {
    next(err)
  }
});

app.get('/fruits', async (req, res, next) => {
  try {
    const allFruits = await db.collection('fruits').find().toArray();
    res.send(allFruits);
  } catch (err) {
    next(err);
  }
});

app.post('/fruits', async (req, res, next) => {
  try {
    const { name, color } = req.body;
    console.log({ name, color })
    await db.collection('fruits').insertOne({ name, color })
    res.send(`${name}, ${color} inserted`)
  } catch (err) {
    next(err)
  }
});

app.get('/fruits/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const obj = new ObjectID(id)
    const fruit = await db.collection('fruits').findOne(obj)
    if (fruit) {
      res.send(fruit);
    } else {
      res.status(400)
    }
  } catch (err) {
    next(err);
  }
});

app.put('/fruits/:id', async (req, res, next) => {
  //todo
});

app.delete('/fruits/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const obj = new ObjectID(id)
    const fruit = await db.collection('fruits').findOne(obj)
    const result = await db.collection('fruits').deleteOne(fruit);

    if (result.deletedCount > 0) {
      res.send(`${id} deleted`)
    } else {
      res.status(400).send(`${id} not found`)
    }
  } catch (err) {
    next(err)
  }
});

app.use((req, res) => {
  res.status(404).send('404: Not found');
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
