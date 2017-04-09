const Person = require('../mongodb/models/person');
const axios = require('axios');
const api = require('../creds/apikey')

const API_KEY = api.key;
const API_ROOT = 'https://api.worldoftanks.com/wot/account/list/?';
const APPLICATION_ID = `application_id=${API_KEY}&`;
const TYPES = 'type=startswith&language=en';
const SEARCH = '&search=';

const FULL_URL = API_ROOT + APPLICATION_ID + TYPES;

const resolverMap = {
  Query: {
    persons() {
      return new Promise((resolve, reject) => {
        Person.find({ })
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
          url = `${FULL_URL}${SEARCH}${args.nickname}`;
        else
          reject('Nickname is required');
        axios.get(url)
          .then((players) => {
            resolve(players.data.data);
          })
          .catch((err) => reject(err));
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
    }
  }
};

export default resolverMap;
