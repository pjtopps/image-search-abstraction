const https = require('https');
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://pete:2299@ds147964.mlab.com:47964/image-searches';

module.exports = (app) => {
  app.get('/search/:queries?', (req, res) => {
    //enter term and time of request into database
    mongo.connect(mongoUrl, (err, db) => {
      if (err) throw err;

      const collection = db.collection('ips');
      const time = new Date().toISOString();
      const clientsIp = req.ip;

      collection.insertOne({
        ip: clientsIp,
        term: req.query.term,
        time,
      });

      db.close();
    });

    const offset = Number(req.query.offset) ? req.query.offset : 1;
    //send a http request to gain the image info, then return to the client
    var options = {
      hostname: 'www.googleapis.com',
      port: 443,
      path: '/customsearch/v1?cx=007610245686629188885:sa5b36f7www&key=AIzaSyDgqqDzrhaI4hTPeeLLdyaoI0MfRjVddr8&searchType=image&q=' + req.query.term,
      method: 'GET'
    };

    var request = https.request(options, (response) => {
      let answer = '';

      response.on('data', (d) => {
        answer += d.toString('utf8');
      });

      response.on('end', () => {
        answer = JSON.parse(answer);
        res.send(JSON.stringify(answer.items.slice(0, offset)));
      });

    });

    request.on('error', (e) => {
      console.log(e);
    });

    request.end();

  });
};
