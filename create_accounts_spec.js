TEST_USERS = [{'fn' : 'Test', 'ln' : 'User1',
               'email' : 'testuser1@example.com', 'pwd' : 'testUser123'},
              {'fn' : 'Test', 'ln' : 'User2',
               'email' : 'testuser2@example.com', 'pwd' : 'testUser123'},
              {'fn' : 'Test', 'ln' : 'User3',
               'email' : 'testuser3@example.com', 'pwd' : 'testUser123'}]
var frisby = require('frisby');
var tc = require('./Config/test_config');

TEST_USERS.forEach(function createUser(user, index, array) {
    it('POST enroll user ' + user.email, function(){
      return  frisby.post(tc.url + '/user/enroll',
        { 'firstName' : user.fn,
          'lastName' : user.ln,
          'email' : user.email,
          'password': user.pwd
           })
          .expect('status',201)
          .expect('header','Content-Type', 'application/json; charset=utf-8')
          .expect('json',{ 'firstName' : user.fn,
                        'lastName' : user.ln,
                        'email' : user.email,
                        'password': user.pwd })
                        // .done(done);
    });
});


it('POST enroll duplicate user', function(){
return frisby.post(tc.url + '/user/enroll',
          { 'firstName' : TEST_USERS[0].fn,
            'lastName' : TEST_USERS[0].ln,
            'email' : TEST_USERS[0].email,
            'password': TEST_USERS[0].pwd
            })
            .expect('status',400)
            .expect('header','Content-Type', 'application/json; charset=utf-8')
            .expect('json',{'error' : 'Account with that email already exists.  Please choose another email.'})
})