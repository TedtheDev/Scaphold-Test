const mongoose = require('mongoose');
if(process.env.MONGODB_URI)
  const creds = require('../../creds/creds');

const startDB = (database) => {
  if(!process.env.MONGODB_URI)
    mongoose.connect(`mongodb://${creds.user}:${creds.pwd}@localhost/${database}?authSource=${creds.authSource}`);
  else {
    mongoose.connect(process.env.MONGODB_URI);
  }
  mongoose.connection
    .once('open', () => console.log('MongoDB Connected') )
    .on('error', (error) => {
      console.warn('Warning', error);
    });
}

module.exports = startDB;
