const express = require('express');
const mongoose = require('mongoose');

const PORT = 3100;
const DATA = [
  { name: 'Apfel', color: 'gelb,rot' },
  { name: 'Birne', color: 'gelb,grün' },
  { name: 'Banane', color: 'gelb' },
];

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url = 'mongodb://localhost:27017/food';
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('connected to database food ...');
  });

// Define Mongoose-Schema
const schema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true }
});

// Mongoose-Model
const Fruit = mongoose.model('Fruits', schema);

app.post('/init-db', async (req, res) => {
  const result = await Fruit.insertMany(DATA);
  console.log(result)
  res.send(result)
});

app.get('/fruits', async (req, res) => {
  const fruits = await Fruit.find();
  res.send(fruits)
});

app.post('/fruits', async (req, res) => {
  const result = await Fruit.create({ name: req.body.name, color: req.body.color });
  res.send(result);
});

app.get('/fruits/:id', async (req, res) => {
  const objId = mongoose.Types.ObjectId(req.params.id)
  const result = await Fruit.findById(objId)
  res.send(result);
});

app.put('/fruits/:id', async (req, res) => {
  await Fruit.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    {
      $set: {
        name: req.body.name,
        color: req.body.color,
      },
    }
  );
  res.send(`updated`);
});

app.delete('/fruits/:id', async (req, res) => {
  const result = await Fruit.findOneAndDelete({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
  res.send(result);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
