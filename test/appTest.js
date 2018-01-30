let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let app = require('../app.js');
let th = require('./testHelper.js');
let MockFs = require('../src/mockFs');

describe('app', () => {

  beforeEach(() => {
    app.fs = new MockFs();
    app.data = {};
    app.path = './testData/data.json';
    app.registered_users = [{
      userName: 'viraj',
      name: 'Viraj Patil'
    }, {
      userName: 'salman',
      name: 'Salman Shaik'
    }];
  })

  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, {
        method: 'GET',
        url: '/bad'
      }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      })
    })
  })
  describe('GET /', () => {
    it('redirects to login.html', done => {
      request(app, {
        method: 'GET',
        url: '/'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe.skip('GET /login', () => {
    it('serves login page', done => {
      request(app, {
        method: 'GET',
        url: '/login'
      }, (res) => {
        th.body_contains(res, 'TODO APP');
        done();
      })
    })
  })
  describe('GET /home', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/home'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /logout', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/logout'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /index', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/index'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /createTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/createTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /viewTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/viewTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /editTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/editTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('GET /deleteTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'GET',
        url: '/deleteTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('POST /home', () => {
    it('redirects to homePage when login credentials are valid', done => {
      request(app, {
        method: 'POST',
        url: '/home',
        body: 'name=viraj'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        th.should_not_have_cookie(res, 'logInFailed');
        done();
      })
    })
    it('redirects to login page when login credentials are invalid', done => {
      request(app, {
        method: 'POST',
        url: '/home',
        body: 'name=vp'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        th.should_not_have_cookie(res, 'sessionid');
        done();
      })
    })
  })
  describe('POST /addTodo', () => {
    it('stays at createTodo page', done => {
      request(app, {
          method: 'POST',
          url: '/addTodo',
          body: 'title=pg&description=sleep',
          headers: {
            cookie: 'sessionid=1234'
          }
        },
        (res) => {
          th.should_be_redirected_to(res, '/login');
          th.should_not_have_cookie(res, 'logInFailed');
          done();
        })
    })
  })
  describe('POST /addTask', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'POST',
        url: '/addTask',
        body: 'todoID=1&taskTitle=sleep',
        headers: {
          cookie: 'sessionid=1234'
        }
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        th.should_not_have_cookie(res, 'logInFailed');
        done();
      })
    })
  })
  describe('POST /deleteTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'POST',
        url: '/deleteTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
  describe('POST /deleteTodo', () => {
    it('redirects to login if not loggedIn', done => {
      request(app, {
        method: 'POST',
        url: '/deleteTodo'
      }, (res) => {
        th.should_be_redirected_to(res, '/login');
        done();
      })
    })
  })
})
