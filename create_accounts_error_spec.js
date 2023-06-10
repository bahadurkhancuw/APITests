TU1_FN = "Test";
TU1_LN = "User1";
TU1_EMAIL = "testuser1@example.com";
TU1_PW = "testUser123";
TU_EMAIL_REGEX = 'testuser*';
SP_APP_NAME = 'Reader Test';
var frisby = require('frisby');
var tc = require('./Config/test_config')



it('POST missing name', function(){
return frisby.post(tc.url + '/user/enroll',
        {
            'lastName': TU1_LN,
            'email': TU1_EMAIL,
            'password': TU1_PW
        })
        .expect('status',400)
        .expect('header','Content-Type', 'application/json; charset=utf-8')
        .expect('json',{ 'error': 'Undefined First Name' })
})

it('POST password missing lowercase', function(){
return frisby.post(tc.url + '/user/enroll',
        {
            'firstName': TU1_FN,
            'lastName': TU1_LN,
            'email': TU1_EMAIL,
            'password': 'TESTUSER123'
        })
        .expect('status',400)
        .expect('header','Content-Type', 'application/json; charset=utf-8')
        .expect('jsonTypes',{ 'error': "Invalid Password format" })
})

it('POST invalid email address', function(){ 
    return frisby.post(tc.url + '/user/enroll',
        {
            'firstName': TU1_FN,
            'lastName': TU1_LN,
            'email': "invalid.email",
            'password': 'testUser'
        })
        .expect('status',400)
        .expect('header','Content-Type', 'application/json; charset=utf-8')
        .expect('jsonTypes',{ 'error': "Invalid email format" })
})