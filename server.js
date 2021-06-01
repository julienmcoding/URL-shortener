require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.myfqo.mongodb.net/${process.env.DB_DATABSE}?retryWrites=true&w=majority`;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let urlSchema = new mongoose.Schema({
  original_url : {type: String, required: true},
  short_url: Number
})

let Url = mongoose.model('Url', urlSchema)

app.post('/api/shortURL', async (req, res) => {

  // check if url is valid
  const urlExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  let input = req.body['url'];
  let shortId = 1;

  if(!input.match(urlExp)) {
    res.json({ error: 'invalid url' });
  };

  //check is url is already in the database
  try {
    let findOne = await Url.findOne({
      original_url: input
    });
    if (findOne) {
      res.json({
        original_url: findOne.original_url,
        short_url: findOne.short_url
      });

    // create the new url if it doesn't exist yet
    } else {
      findOne = new Url({
        original_url: input,
        short_url: shortId
      })
      await findOne.save()
      shortId++;
      res.json({
        original_url: findOne.original_url,
        short_url: findOne.short_url
      })
    }
  } catch (err) {
    console.error(err.message);
  };
});

app.get('/api/shorturl/:id', async (req, res) => {
  try {
    const urlInput = await Url.findOne({
      short_url: req.params.id
    });
    if(urlInput) {
      res.redirect(urlInput.original_url)
    } else {
      res.status(404).json('This URL is not in the database')
    };
  } catch (err) {
    console.error(err.message);
  };
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
