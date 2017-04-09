const startDB = require('./connection/mongoconnection');
const Person = require('./models/person');

//startDB('scaphold-test');

const person = new Person({
  name: "John",
  city: 'Minneapolis',
  state: "Minnesota",
  avgHoursPerWeek: 7,
  username: "tankmaster",
  favoriteTank: "T34"
});

person.save()
  .then(() => Person.find({}))
  .then((persons) => console.log(persons));
