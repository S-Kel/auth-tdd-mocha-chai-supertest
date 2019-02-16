const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = require('../seeds/seed');

// console.log(users)
// Users Schema
const userSchema = new Schema({
  name: { type: String, required: true},
  password: { type: String, required: true },
}); 

// User Model
const User = mongoose.model('user', userSchema);

// mongoose.connect('mongodb://localhost/user-auth-test', { useNewUrlParser: true });
const dbConn = 'mongodb://localhost/user-auth-test';
mongoose
  .connect(dbConn, { useNewUrlParser: true, useCreateIndex: true })
  .then(
    () => console.log('MongoDb is ready to use'),
    err => console.log("Could not connect to MongoDB")
  );


// Users Seed data
const syncAndSeed = () =>{
  console.log('syncAndSeed Starting...')
  User.deleteMany({})
    .then(res=> {
      console.log('successfully deleted all')
      User.insertMany(users)
        .then(user => {
          console.log('Users saved successfuly');
          // mongoose.disconnect();
        })
        .catch(err=> console.log('Could not save the users'));
    })
    .catch(err=> console.log('There was an error deleting users', err));
}

module.exports = { User, syncAndSeed};