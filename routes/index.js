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

/*
stats : give summary of given data
*/
router.get('/stats', (req, res) => {
  let most_active = {};
  let attacker_outcome = {};
  let battle_type = [];
  let defender_size = [];

  GotDocument.aggregate([{
    $group: {
      _id: "$attacker_king",
      count: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      count: -1
    }
  }, {
    $limit: 1
  }]).exec((err, data) => {
    if (!err) {
      data.forEach(data => {
        most_active.attacker_king = data._id;
        GotDocument.aggregate([{
          $group: {
            _id: "$defender_king",
            count: {
              $sum: 1
            }
          }
        }, {
          $sort: {
            count: -1
          }
        }, {
          $limit: 1
        }]).exec((err, data) => {
          if (!err) {
            data.forEach(data => {
              most_active.defender_king = data._id;
              GotDocument.aggregate([{
                $group: {
                  _id: "$region",
                  count: {
                    $sum: 1
                  }
                }
              }, {
                $sort: {
                  count: -1
                }
              }, {
                $limit: 1
              }]).exec((err, data) => {
                if (!err) {
                  data.forEach(data => {
                    most_active.region = data._id;
                    GotDocument.aggregate([{
                      $group: {
                        _id: "$attacker_outcome",
                        count: {
                          $sum: 1
                        }
                      }
                    }, {
                      $sort: {
                        count: -1
                      }
                    }, {
                      $limit: 2
                    }]).exec((err, data) => {
                      if (!err) {
                        data.forEach(data => {
                          if (data._id == 'win') {
                            attacker_outcome.win = data.count
                          } else if (data._id == 'loss') {
                            attacker_outcome.loss = data.count
                          }
                        })
                        GotDocument.aggregate([{
                          $group: {
                            _id: "$battle_type",
                          }
                        }]).exec((err, data) => {
                          if (!err) {
                            data.forEach(data => {
                              battle_type.push(data._id);
                            })
                            GotDocument.aggregate([{
                              $group: {
                                _id: "$summer",
                                minDefenderSize: {
                                  $min: "$defender_size"
                                },
                                maxDefenderSize: {
                                  $max: "$defender_size"
                                },
                                avgDefenderSize: {
                                  $avg: "$defender_size"
                                }
                              }
                            }]).exec((err, data) => {
                              if (!err) {
                                data.forEach(data => {
                                  defender_size.push(data);
                                })
                                res.json({
                                  most_active,
                                  attacker_outcome,
                                  battle_type,
                                  defender_size
                                })
                              } else {
                                console.log('Error occured', err);
                                return;
                              }
                            });

                          } else {
                            console.log('Error occured', err);
                            return;
                          }
                        });

                      } else {
                        console.log('Error occured', err);
                        return;
                      }
                    });
                  })
                } else {
                  console.log('Error occured', err);
                  return;
                }
              });
            })
          } else {
            console.log('Error occured', err);
            return;
          }
        });
      })
    } else {
      console.log('Error occured', err);
      return;
    }
  });





})
module.exports = router;
