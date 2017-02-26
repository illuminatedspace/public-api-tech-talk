const router = require('express').Router();
const axios = require('axios');
//key is in an untracked file to keep it private
const apiKey = require('../apiKey');

router.get('/', (req, res, next) => {
  let senators = [];
  let representatives = [];

  //get list of senators
  axios.get('https://api.propublica.org/congress/v1/115/senate/members.json', {
    headers: { 'X-API-Key': apiKey }
  })
  .then(results => {
    let list = results.data.results[0].members;
    for (let senator of list) {
      let entry = {
        memberId: senator.id,
        name: `${senator.last_name}, ${senator.first_name}`,
        party: senator.party,
        state: senator.state
      };
      senators.push(entry);
    }
  })
  .then( () => {
    return axios.get('https://api.propublica.org/congress/v1/115/house/members.json', {
      headers: { 'X-API-Key': apiKey }
    });
  })
  .then(results => {
    let list = results.data.results[0].members;
    for (let rep of list) {
      let entry = {
        memberId: rep.id,
        name: `${rep.last_name}, ${rep.first_name}`,
        party: rep.party,
        state: rep.state
      };
      representatives.push(entry);
    }
  })
  .then( () => {
    res.render('index', {
      senators: senators,
      representatives: representatives
    });
  });
})

router.get('/senate/member/test', (req, res, next) => {
  res.render('congressperson');
})

//simple routing for testing
//should return Charles Schumer Info
router.get('/senate/member/schumer', (req, res, next) => {
  axios.get('https://api.propublica.org/congress/v1/members/S000148.json', {
        headers: { 'X-API-Key': apiKey }
    })
  .then(results => {
    // console.log(results.data);
    return res.send(results.data.results);
  })
  .catch(next);
});

//should return missed votes Info
router.get('/senate/votes/missed', (req, res, next) => {
  axios.get('https://api.propublica.org/congress/v1/115/senate/votes/missed.json', {
        headers: { 'X-API-Key': apiKey }
    })
  .then(results => {
    // console.log(results.data);
    return res.send(results.data.results);
  })
  .catch(next);
});

module.exports = router;
