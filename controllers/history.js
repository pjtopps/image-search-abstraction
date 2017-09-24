const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://pete:2299@ds147964.mlab.com:47964/image-searches';

module.exports = function(app) {
  app.get('/history', (req, res) => {
    mongo.connect(mongoUrl, (err, db) => {
      const collection = db.collection('ips');
      const clientsIp = req.ip;

      const cursor = collection.find({ ip: clientsIp });
      const ans = [];

      cursor.forEach((doc) => {
        ans.push({
          term: doc.term,
          time: doc.time,
        });
      },
      () => {
        res.send(ans);
        db.close();
      });
    });
  })
};
