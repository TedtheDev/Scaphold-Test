const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: String,
  city: String,
  state: String,
  avgHoursPerWeek: Number,
  username: String,
  favoriteTank: String
});

const Person = mongoose.model('person', PersonSchema);

module.exports = Person;
