'use strict';

const Person = require('../mongodb/models/person');
const axios = require('axios');
const lo = require('lodash');

if(process.env.WARGAMING_API_KEY)
  var api = process.env.WARGAMING_API_KEY
else
  var api = require('../creds/apikey')

const API_KEY = (!process.env.WARGAMING_API_KEY) ? api.key : api;
const API_ROOT = 'https://api.worldoftanks.com/wot/';
const APPLICATION_ID = `&application_id=${API_KEY}`;

//TYPES OF SEARCHES
//----------------
//get player account_id and nickname using exact search by username
const API_PLAYER_SEARCH = '/account/list/?type=exact&language=en&search=';

// get vehicles of player by account id
const API_TANKS_BY_PLAYER_SEARCH = '/account/tanks/?fields=tank_id&language=en&account_id=';

//get all vehicle names
const API_GET_TANKS_NAME = '/encyclopedia/vehicles/?fields=name,tank_id&language=en';

const API_GET_FAV_TANK_STATS = '/tanks/stats/?fields=all&language=en&tank_id=';


const resolverMap = {
  Query: {
    persons(_, args) {
      const findParams = {};
      const {name, username } = args;
      if(name)
        findParams["name"] = name;
      if(username)
        findParams["username"] = username;
      return new Promise((resolve, reject) => {
        Person.find(findParams)
          .then((thepersons) => {
            resolve(thepersons);
        })
        .catch((err) => reject(err));
      });
    },
    players(_, args) {
      return new Promise((resolve, reject) => {
        let url;
        if(args.nickname !== null || args.nickname !== undefined)
          url = `${API_ROOT}${API_PLAYER_SEARCH}${args.nickname}${APPLICATION_ID}`;
        else
          reject('Nickname is required');
        axios.get(url)
          .then((players) => {
            resolve(players.data.data);
          })
          .catch((err) => reject(err));
      })
    },
    getPlayerFavTankStats(_, args) {
      return new Promise((resolve,reject) => {
        axios.get(`${API_ROOT}${API_PLAYER_SEARCH}${args.username}${APPLICATION_ID}`) //get player account_id
        .then((accountId) => {
          axios.get(`${API_ROOT}${API_GET_TANKS_NAME}${APPLICATION_ID}`)
            .then((tankIds) => {
              let theTanksList = lo.mapValues(tankIds.data.data, (tank) => {
                return tank.name
              })
              theTanksList = lo.invert(theTanksList);
              axios.get(`${API_ROOT}${API_GET_FAV_TANK_STATS}${theTanksList[args.favoriteTank]}&account_id=${accountId.data.data[0].account_id}${APPLICATION_ID}`)
                .then((favTankData) => {
                  resolve(favTankData.data.data[Object.keys(favTankData.data.data)[0]][0].all);
                })
                .catch((err) => { reject(err); })
            })
            .catch((err) => { reject(err); })
        })
        .catch((err) => { reject(err);})
      })
    }
  },
  Mutation: {
    createPerson(_, args) {
      const aPerson = new Person({
        name: args.name,
        city: args.city,
        state: args.state,
        avgHoursPerWeek: args.avgHoursPerWeek,
        username: args.username,
        favoriteTank: args.favoriteTank
      });
      return aPerson.save()
        .then(() => Person.findById({ _id: aPerson._id }))
        .then((person) => {
          return person
        })
        .catch((err) => err);
    },
    deletePerson(_, args) {
      return Person.findOneAndRemove({ name: args.name, username: args.username })
        .then((person) => {
          return person
        })
        .catch((err) => err);
    },
    updatePerson(_, args) {
      const { targetName, targetUsername, name, city, state, avgHoursPerWeek, username, favoriteTank } = args;
      let updateParams = {};
      if(name)
        updateParams["name"] = name;
      if(city)
        updateParams["city"] = city;
      if(state)
        updateParams["state"] = state;
      if(avgHoursPerWeek)
        updateParams["avgHoursPerWeek"] = avgHoursPerWeek;
      if(username)
        updateParams["username"] = username;
      if(favoriteTank)
        updateParams["favoriteTank"] = favoriteTank;

      return Person.findOneAndUpdate({ name: targetName, username: targetUsername }, updateParams)
        .then((person) => Person.findOne({ _id: person._id}))
        .then((person) => {
          return person;
        })
        .catch((err) => err);
    }
  }
};

export default resolverMap;
