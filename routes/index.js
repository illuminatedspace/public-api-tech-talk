const router = require('express').Router();
const axios = require('axios');
//key is in an untracked file to keep it private
const apiKey = require('../apiKey');

//homepage
router.get('/', (req, res, next) => {
  let senators = [],
      representatives = [];

  //get list of senators and representatives for index dropdowns
  //*refactor: is there a better way to do this with promise.all?
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
    //return the object with all the senators and reps for the nunjucks template
    res.render('index', {
      senators: senators,
      representatives: representatives
    });
  })
  .catch(next);
});

//congressperson page
router.get('/:chamber/member/:memberId', (req, res, next) => {
  //set memberid in var
  //make missed votes arr
  //make party votes arr
  var memberId = req.params.memberId,
      chamber = req.params.chamber,
      missedVotes = [],
      partyVotes = [],
      info = {};

  //get info for member
  axios.get(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
    headers: { 'X-API-Key': apiKey }
  })
  //get selected member
  .then(results => {
    let memberArr = results.data.results[0].members;
    let member = memberArr.filter((entry) => entry.id === memberId)[0];
    //set info
    info = {
      name: `${member.first_name} ${member.last_name}`,
      state: member.state,
      party: member.party,
      nextElection: member.next_election
    }
    //set missedVotes
    missedVotes = [{
      label: 'Missed Votes', count: member.missed_votes
    }, {
      label: 'Present Votes', count: member.total_votes - member.missed_votes
    }];
    //set partyVotes
    partyVotes = [{
      label: 'With Party', count: member.votes_with_party_pct
    }, {
      label: 'Against Party', count: (100 - member.votes_with_party_pct).toFixed(2)
    }];
    // res.send(member);
  })
  //render congressperson and pass the missed votes, party votes, and info
  .then(() => {
    res.render('congressperson', {
      info: info,
      missedVotes: missedVotes,
      partyVotes: partyVotes
    })
  })
  .catch(next);
})

//simple routing for testing
//test route to see congressperson template
router.get('/senate/member/test', (req, res, next) => {
  res.render('congressperson');
})

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
