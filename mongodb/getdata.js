const startDB = require('./connection/mongoconnection')
const Person = require('./models/person');

//startDB('scaphold-test');

Person.find({})
  .then((people) => console.log(people))
