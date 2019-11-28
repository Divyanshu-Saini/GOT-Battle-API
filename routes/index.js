var express = require('express');
var router = express.Router();
const GotDocument = require('../models/GotModel');
const helper = require('./helper');

/* Ping server . */
router.get('/', (req, res, ) => {
  res.send(`Server Running ${new Date()}`)
});

/*
list : returns list(array) of all the places where the battle has taken place.
*/
router.get('/list', (req, res) => {
  GotDocument.aggregate([{
    $group: {
      "_id": "$location"
    }
  }]).exec((err, locations) => {
    if (!err) {
      let loc = [];
      locations.forEach(location => {
        loc.push(location._id);
      })
      res.json(loc);
    } else {
      res.json(err);
    }
  });
});

/* 
count : returns the total number of battles occurred.
*/
router.get('/count', (req, res) => {
  let totalBattle = 0;
  GotDocument.count((err, count) => {
    if (!err) {
      totalBattle = count;
      res.json({
        totalBattle
      });
    } else {
      res.json({
        "Error :": "No Battale found",
        err
      });
    };
  });
});

/* 
search: returns list of battles for provided search query
*/
router.get('/search', (req, res) => {
  let query = req.query;
  let keys = Object.keys(query);
  let matches = helper.buildSearchQuery(keys, query);

  GotDocument.aggregate([{
    $match: {
      $and: matches
    }
  }, {
    $project: {
      name: 1
    }
  }]).exec((err, gotObj) => {
    let bName = [];
    if (!err) {
      gotObj.forEach(obj => {
        bName.push(obj.name);
      });
      res.json(bName);
    } else {
      res.json(err);
    }
  });
});

module.exports = router;
