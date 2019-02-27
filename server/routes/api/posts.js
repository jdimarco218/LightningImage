const axios   = require('axios');
const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

var dbUrl = 'mongodb+srv://Jeff:DoubleDownml5333!@cluster0-rigj4.mongodb.net/test?retryWrites=true';
var dbConnection = mongodb.MongoClient.connect(dbUrl);
    

// Get Posts
router.get('/', async(req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Get Captions
router.get('/captions', async(req, res) => {
    const posts = await loadCaptionsCollection();
    res.send(await posts.find({}).toArray());
});

// Get Current Main Post
router.get('/main/', async(req, res) => {
    const posts = await loadPostsCollection();
    var responseVal = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/153/high-voltage-sign_26a1.png';
    responseVal = await posts.findOne({"paid":true},{"createdAt_-1_paid_1":1});
    await res.status(200).send(responseVal.text);
});

// Get Current Main Caption
router.get('/main/caption', async(req, res) => {
    const posts = await loadCaptionsCollection();
    var responseVal = "Lightning Caption";
    responseVal = await posts.findOne({"paid":true},{"createdAt_-1_paid_1":1});
    await res.status(200).send(responseVal.text);
});

// Check for new main post
router.get('/update/', async(req, res) => {
    console.log("UPDATE MADE IT WOO");
    io.send('update get request io blah');
    await res.status(200).send();
});

// Check for new main post
router.post('/update/', async(req, res) => {
    console.log("UPDATE POST MADE IT WOO");
    const posts = await loadPostsCollection();
    var captionsArray = await posts.find({}).toArray();
    var notFound = true;
    for (var i = captionsArray.length - 1; notFound && i >= 0; i--) {
        if (captionsArray[i].hasOwnProperty("charge_id")) {
            const chargeUrl = 'https://dev-api.opennode.co/v1/charge/' + captionsArray[i]["charge_id"];
            await axios.get(chargeUrl, { headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
            }})
            .then(response => {
                if (response.status === 200 &&
                    response.data.data.status === 'paid') {
                    responseVal = captionsArray[i].text;
                    notFound = false;
                    posts.findOneAndUpdate(
                        { "charge_id": response.data.data.id },
                        { $set: {"paid": true } },
                        { upsert: true}
                    );
                }
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }
    }
    console.log("Done.");
    io.send('update sending blah');
    io.emit('message', {
        type: 'update',
        message: 'updated bro'
    });
    await res.status(200).send();
});

// Check for new main caption
router.post('/update/captions', async(req, res) => {
    console.log("CAPTION UPDATE POST MADE IT WOO");
    //io.send('caption update sending blah');
    //io.emit('captionMsg', {
    //    type: 'update',
    //    message: 'updated bro'
    //});
    //const captions = await loadCaptionsCollection();
    //captions.update(criteria[])
    //console.log('caption update req: ');
    //console.log(req);
    //await res.status(200).send();
    const posts = await loadCaptionsCollection();
    var captionsArray = await posts.find({}).toArray();
    var notFound = true;
    var responseVal = 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/153/high-voltage-sign_26a1.png';
    for (var i = captionsArray.length - 1; notFound && i >= 0; i--) {
        if (captionsArray[i].hasOwnProperty("charge_id")) {
            const chargeUrl = 'https://dev-api.opennode.co/v1/charge/' + captionsArray[i]["charge_id"];
            await axios.get(chargeUrl, { headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
            }})
            .then(response => {
                if (response.status === 200 &&
                    response.data.data.status === 'paid') {
                    responseVal = captionsArray[i].text;
                    notFound = false;
                    posts.findOneAndUpdate(
                        { "charge_id": response.data.data.id },
                        { $set: {"paid": true } },
                        { upsert: true}
                    );
                }
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }
    }
    console.log("Done.");
    io.send('caption update sending blah');
    io.emit('captionMsg', {
        type: 'update',
        message: 'updated bro'
    });
    await res.status(200).send(responseVal);
});

//Add Posts
router.post('/', async(req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date(),
        charge_id: req.body.charge_id,
        paid: false
    });
    res.status(201).send();
});

//Add Caption
router.post('/captions', async(req, res) => {
    const captions = await loadCaptionsCollection();
    await captions.insertOne({
        text: req.body.text,
        createdAt: new Date(),
        charge_id: req.body.charge_id,
        paid: false
    });
    res.status(201).send();
});


// Delete Post
router.delete('/:id', async(req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadPostsCollection() {
    try {
      const client = await mongodb.MongoClient.connect('mongodb+srv://Jeff:DoubleDownml5333!@cluster0-rigj4.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

      return client.db('vue_express').collection('posts');
    } catch(err) {
        alert(`Db connection error: ${err}`);
        return [];
    }
}

async function loadCaptionsCollection() {
    try {
      const client = await mongodb.MongoClient.connect('mongodb+srv://Jeff:DoubleDownml5333!@cluster0-rigj4.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

      return client.db('vue_express').collection('captions');
    } catch(err) {
        alert(`Db connection error: ${err}`);
        return [];
    }
}

module.exports = router;