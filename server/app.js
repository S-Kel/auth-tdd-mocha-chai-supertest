// Require in third-party modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Create server from express
const app = express();

// Connect DB
const dbConn = 'mongodb://localhost/user-auth';
mongoose
  .connect(dbConn, { useNewUrlParser: true, useCreateIndex: true })
  .then(
    () => console.log('MongoDb is ready to use'),
    err => console.log("Could not connect to MongoDB")
  );

//Models
const { User } = require('./db');

// Apply middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'mysecret', 
  resave: true,
  saveUninitialized: true})); //TO UPDATE 

//Test
const index = ({ user, error }) =>{
  return `
    <html>
      <body>
        welcome ${user ? (',' + user.name) : ''}
        ${ user ? 
          `<a href='/logout'>Logout</a>` : 
          `<form method='POST' action='/login' >
            <input name='name' type='text' />
            <input name='password' type='text' />
            <button>Login</button>
          </form>`
        }
        ${ error ? error : '' }
      </body>
    </html>
  `;
}
app.use( async(req, res, next) => {
  if (!req.session || !req.session.userId) return next();
  try {
    const user = await User.findById(req.session.userId);
    req.user = user;
    next();
  } catch (error) { res.sendStatus(404); }
});

// Load routes
app.get('/', async (req, res, next)=>{
  await res.send(index({ user: req.user, error: null}));
});
app.get('/logout', async(req, res, next)=>{
  await req.session.destroy(() => res.redirect('/'));  
});
app.post('/login', async (req, res, next)=>{
  const {name, password } = req.body;
  console.log('name & password------------->', name, password);
  
  try {
    const user = await User.findOne({name, password});

    req.session.userId = user.id;
    res.redirect('/');
  } catch (error) { res.send(index({ user: null, error: 'bad credentials' })) }
});

// Catch 404 errors

// Catch all other errors

// // Start server on port
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));

module.exports = app;