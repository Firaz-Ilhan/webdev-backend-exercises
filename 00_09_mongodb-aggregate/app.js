const express = require('express');
const { MongoClient } = require('mongodb');

const PORT = 3100;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let db = null;
const url = `mongodb://localhost:27017`;
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((connection) => {
  db = connection.db('restaurants');
  console.log('connected to database...');
});

app.get('/restaurants', async (req, res, next) => {
  try {
    const { cuisine, zipcode } = req.query;

    const restaurants = await db
      .collection('restaurants')
      .aggregate([
        { $match: { cuisine, 'address.zipcode': zipcode } }, // where in sql
        { $project: { name: 1, address: 1, _id: 0 } }, // select in sql
        { $sort: { name: 1 } },
      ])
      .toArray();
    res.send(restaurants)
  } catch (err) {
    next(err)
  }
});

app.get('/areas', async (req, res, next) => {
  try {
    const { cuisine, borough } = req.query;
    const areas = await db
      .collection('restaurants')
      .aggregate([
        { $match: { cuisine: cuisine, borough: borough } },
        { $project: { name: '$name', zipcode: '$address.zipcode', avg_score: { $avg: '$grades.score' } } },
        { $group: { _id: '$zipcode', avg_score: { $avg: '$avg_score' } } },
        { $sort: { avg_score: 1 } }
      ])
      .toArray();

    res.send(areas)
  } catch (err) {
    next(err)
  }
});

app.use((req, res) => {
  res.status(404).send('404: Not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
  console.error(err);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
