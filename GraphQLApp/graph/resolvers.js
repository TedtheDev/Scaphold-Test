const Person = require('../mongodb/models/person');

const resolverMap = {
  Query: {
    persons() {
      return new Promise((resolve, reject) => {
        Person.find({ })
          .then((persons) => {
            resolve(persons);
        });
      })
    }
  }
};

export default resolverMap;
