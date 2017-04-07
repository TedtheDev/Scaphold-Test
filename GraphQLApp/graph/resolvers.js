const Person = require('../mongodb/models/person');

const resolverMap = {
  Query: {
    persons() {
      return new Promise((resolve, reject) => {
        Person.find({ })
          .then((persons) => {
            resolve(persons);
        })
        .catch((err) => reject(err));
      });
    }
  },
  Mutation: {
    createPerson(name, city, state, avgHoursPerWeek, username, favoriteTank) {
      const aPerson = new Person({
        name: name,
        city: city,
        state: state,
        avgHoursPerWeek: avgHoursPerWeek,
        username: username,
        favoriteTank: favoriteTank
      });
      return new Promise((resolve, reject) => {
        aPerson.save()
          .then((thePerson) => {
            resolve(thePerson);
        })
        .catch((err) => {
          console.log(err.errors);
          reject(err)
        });
      });
    }
  }
};

export default resolverMap;
