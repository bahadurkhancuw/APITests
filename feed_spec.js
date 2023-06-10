TEST_USERS = require('./tmp/readerTestCreds.js');
var frisby = require('frisby');
var tc = require('./Config/test_config');
var async = require('async');
var dbConfig = require('./Config/db.js');
var dilbertFeedURL = 'http://feeds.feedburner.com/DilbertDailyStrip';
var nycEaterFeedURL = 'http://feeds.feedburner.com/eater/nyc';

function addEmptyFeedListTest(callback) {
    var user = TEST_USERS[0];
    it('GET empty feed list for user ' + user.email, function(){
        return frisby.get(tc.url + '/feeds')
        .expect('status',201)
        .expect('header','Content-Type', 'application/json; charset=utf-8')
        .expect('json',{ feeds : [] })
        callback(null);

    })
}

function subOneFeed(callback) {
    var user = TEST_USERS[0];
    it('PUT Add feed sub for user ' + user.email, function () {
        return frisby.put(tc.url + '/feeds/subscribe', {
            'feedURL': dilbertFeedURL, 'email': user.email
        })
            .expect('status', 201)
            .expect('header', 'Content-Type', 'application/json; charset=utf-8')
    })
    callback(null);

}

function subDuplicateFeed(callback) {
    var user = TEST_USERS[0];
            it('PUT Add second for user ' + user.email, function () {
                return frisby.put(tc.url + '/feeds/subscribe', {
                    'feedURL': nycEaterFeedURL, 'email': user.email
                })
                    .expect('status', 201)
                    .expect('header', 'Content-Type', 'application/json; charset=utf-8')
            })
            callback(null);
}



async.series([addEmptyFeedListTest, subOneFeed, subDuplicateFeed]);
