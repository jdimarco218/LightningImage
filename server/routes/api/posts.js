const axios   = require('axios');
const express = require('express');
const mongodb = require('mongodb');
const https   = require('https');

const router = express.Router();

// Get Posts
router.get('/', async(req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Get Current Main Post
router.get('/main/', async(req, res) => {
    const posts = await loadPostsCollection();
    var postsArray = await posts.find({}).toArray();
    var notFound = true;
    var responseVal = [];
    for (var i = postsArray.length - 1; notFound && i >= 0; i--) {
        if (postsArray[i].hasOwnProperty("charge_id")) {
            const chargeUrl = 'https://dev-api.opennode.co/v1/charge/' + postsArray[i]["charge_id"];
            await axios.get(chargeUrl, { headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bd5ecb21-6fba-4cfa-949c-a5c70149ad27'
            }})
            .then(response => {
                if (response.status === 200 &&
                    response.data.data.status === 'paid') {
                    responseVal = postsArray[i].text;
                    notFound = false;
                }
            })
            .catch((error) => {
                console.log('error ' + error);
            });
        }
    }
    console.log("Done.");
    await res.status(200).send(responseVal);
});

//Add Posts
router.post('/', async(req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date(),
        charge_id: req.body.charge_id
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
    const client = await mongodb.MongoClient.connect('mongodb+srv://Jeff:DoubleDownml5333!@cluster0-rigj4.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

    return client.db('vue_express').collection('posts');
}

module.exports = router;