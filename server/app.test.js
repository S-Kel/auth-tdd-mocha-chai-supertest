const db = require('./db');
const expect = require('chai').expect;
const app = require('supertest')(require('./app'));
// const request = require('supertest');
// const app = require('supertest');

// Describe the tests & Expectation
describe('Authenticating', ()=>{
  // db.syncAndSeed();
  beforeEach(()=> db.syncAndSeed());


  it('user can authenticate with correct name and password', ()=>{
    let cookie;
    return app.get('/')
    .expect(200)
    .then(response=>{
      expect(response.text).to.contain('welcome');
      expect(response.text).to.contain('Login');
      return app.post('/login')
        .send('name=moe&password=MOE')
        .expect(302)        
    })
    .then(response => {
      cookie = response.headers['set-cookie'];
      console.log('set cookie', cookie);
      expect(cookie).to.be.ok;

      // Let set cookie
      return app.get('/')
        .set('Cookie', cookie);
    })
    .then(response =>{
      expect(response.text).to.contain('Logout');
      return app.get('/logout')
        .expect(302)
    })
    .then(()=> app.get('/')
    )
    .then(response =>{
      console.log(response.text)
      expect(response.text).to.contain('Login');
    })
  });

  it('user cannot authenticate with incorrect name and password', () => {
    return app.get('/')
      .expect(200)
      .then(response => {
        expect(response.text).to.contain('welcome');
        expect(response.text).to.contain('Login');
        return app.post('/login')
          .send('name=mo&password=MOE')
      })
      .then(response =>{
        console.log('<<user cannot authenticate with incorrect>>>', response.text)
        expect(response.text).to.contain('bad credentials');
      });
  });

});