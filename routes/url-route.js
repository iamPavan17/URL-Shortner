const express = require('express');
const router = express.Router();
const {Url} = require('../models/url');
// const mongoose = require('../config/db');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
var useragent = require('express-useragent');
var ip = require('ip');

module.exports = router;

//getting all the data
// / -> url(/url)
router.get('/', (req, res) => {
    Url.find().then((url) => {
        res.send(url);
    });
});

//getting url's by id
router.get('/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id))
    {
        res.send({
            notice: "invalid id"
        });
        return false;
    }
    Url.findById(id).then(function(url){
        res.send(url);
    })
})

//creating - POST
router.post('/', (req, res) => {
    let body = _.pick(req.body, ['title', 'original_url', 'tags']);
    // let body = req.body;
    let url = new Url(body);
    url.save().then((url) => {
        res.send({
            url,
            notice: 'Successfully created.'
        });
    }).catch((err) => {
        res.send(err);
    });
});

//updating properties - PUT
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['title', 'original_url', 'tags']);
    if(!ObjectId.isValid(id))
    {
        res.send({
            notice: "invalid id"
        });
        return false;
    }
    
    Url.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then((url) => {
        res.send(url);
    });
});

//deleting a url - DELETE
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectId.isValid(id))
    {
        res.send({
            notice: "invalid id"
        });
        return false;
    }

    Url.findByIdAndRemove(id).then((url) => {
        res.send({
            url,
            notice: 'successfully removed'
        });
    });
});


//redirecting to a page via short-url
router.get('/hash/:id', (req, res) => {
    let id = req.params.id;
    var d = `${new Date().toString()}`;
    var i = `${ip.address().toString()}`;
    var b = `${req.useragent.browser.toString()}`;
    var o = `${req.useragent.os.toString()}`;
    var obj = { clicked_date : d , ip_address : i, browser_name : b, Os_type : o };
    Url.find({ hashed_url: id }).then((url) => {
        // res.send(url[0].original_url);
        const u = url[0].original_url;
        // , { $push: { info: obj }}
        // url[0].info.
        // url[0].info.ip_address = `${ip.address().toString()}`;
        // url[0].info.browser_name = `${req.useragent.browser.toString()}`;
        // url[0].info.Os_type = `${req.useragent.os.toString()}`;
        // res.send('hello');

        
        // res.send(u);
        // sending(u);
        // window.location='url[0].original_url';
        // res.render(u);
        res.redirect(u);
    });

    Url.findOneAndUpdate(
        { hashed_url: id }, 
        { $push: { info: obj  } },
       function (error, success) {
             if (error) {
                 console.log(error);
             } else {
                 console.log(success);
             }
         });
});

//getting url that meets the given tags
router.get('/tags/:name', (req, res) => {
    let tagName = req.params.name;
    Url.find({ tags: tagName }).then(function(tag){
        // res.send(tag);
        var tagUrl = [];
        tag.forEach((t) => {
            tagUrl.push(t.original_url);
        });
        res.send(tagUrl);
    });
});
