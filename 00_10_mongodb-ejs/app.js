const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/WDB', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

let db = null;
const url = `mongodb://localhost:27017`;
MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((connection) => {
  db = connection.db('restaurants');
  console.log('connected to database restautants ...');
});

app.get('/restaurants', async (req, res, next) => {
  try {
    const { cuisine, borough } = req.query;

    const restaurants = await db.collection('restaurants')
      .aggregate([
        { $match: { borough: { $regex: borough, $options: 'i' }, cuisine: { $regex: cuisine, $options: 'i' } } },
        {
          $project: {
            _id: 1, name: 1, cuisine: 1, borough: 1, street: '$address.street',
            building: '$address.building', avg_score: { $avg: '$grades.score' }, grades: '$grades.grade'
          }
        },
        { $sort: { avg_score: 1 } },
      ]).toArray()


    const result = restaurants.map(o => ({
      _id: o.id, name: o.name, cuisine: o.cuisine, borough: o.borough,
      street: o.street, avg_score: o.avg_score, lastgrade: o.grades[0]
    }))

    res.render('restaurants', { data: result })

    //res.send(restaurants)
  } catch (err) {
    next(err);
  }
});

app.patch('restaurants/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, street, building, cuisine, borough } = req.body
    const objId = ObjectID(id)

    await db.collection()
      .updateOne(
        { _id: objId },
        {
          $set: { name, cuisine, borough, '$address.street': street, '$address.building': building },
          $currentDate: { lastModified: true }
        },
      )

    res.send('updated')
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).send('404: Not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Snternal server error');
  console.error(err);
});

app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
