var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var stormpath = require('@okta/okta-sdk-nodejs')
var routes = require("./app/routes");
var db	 = require('./Config/db');
var url	 = require('./Config/test_config');
var app = express();
var morgan = require('morgan');
app.use(morgan("dev"));
const client = new stormpath.Client({
    orgUrl: 'dev-87239038.okta.com',
    token: '00eLwCIO4leYcME4IKibeO3vRB-UwdE67YzXA90urg'    // Obtained from Developer Dashboard
  });
// app.use(stormpath.Client(app, {
// apiKeyFile: './config/stormpath_apikey.properties',
// application: 'YOUR SP APPLICATION URL',
// secretKey: security.stormpath_secret_key
// }));
 // "devDependencies": {
  //   // "jasmine": "^5.0.0"
  // }
var port = 8000;
mongoose.connect('mongodb://127.0.0.1:27017/reader_test');
app.use(bodyParser.urlencoded({ extended: true }));
routes.addAPIRouter(app, mongoose, client);

app.use(function(req, res, next){
    res.status(404);
    res.json({ error: 'Invalid URL' });
 });
 app.listen(port);
 console.log('Magic happens on port ' + port);
exports = module.exports = app;