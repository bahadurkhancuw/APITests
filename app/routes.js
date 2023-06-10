let mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    active: Boolean,
    email: { type: String, trim: true, lowercase: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    password: { type: String, trim: true },
    subs: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    created: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
},
    { collection: 'user' }
);

userSchema.index({ email: 1 }, { unique: true });
var UserModel = mongoose.model('User', userSchema);


var feedSchema = new mongoose.Schema({
    feedURL: { type: String, trim: true },
    link: { type: String, trim: true },
    description: { type: String, trim: true },
    state: { type: String, trim: true, lowercase: true, default: 'new' },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
},
    { collection: 'feed' }
);
feedSchema.index({ feedURL: 1 }, { unique: true });
feedSchema.index({ link: 1 }, { unique: true, sparse: true });

var FeedModel = mongoose.model('Feed', feedSchema);

var feedEntrySchema = new mongoose.Schema({
    description: { type: String, trim: true },
    title: { type: String, trim: true },
    summary: { type: String, trim: true },
    entryID: { type: String, trim: true },
    publishedDate: { type: Date },
    link: { type: String, trim: true },
    feedID: { type: mongoose.Schema.Types.ObjectId },
    state: { type: String, trim: true, lowercase: true, default: 'new' },
    created: { type: Date, default: Date.now },
},
    { collection: 'feedEntry' }
);

feedEntrySchema.index({ entryID: 1 });
feedEntrySchema.index({ feedID: 1 });
var FeedEntryModel = mongoose.model('FeedEntry', feedEntrySchema);

var userFeedEntrySchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId },
    feedEntryID: { type: mongoose.Schema.Types.ObjectId },
    feedID: { type: mongoose.Schema.Types.ObjectId },
    read: { type: Boolean, default: false },
},
    { collection: 'userFeedEntry' }
);
userFeedEntrySchema.index({ userID: 1, feedID: 1, feedEntryID: 1, read: 1 });
var UserFeedEntryModel = mongoose.model('UserFeedEntry', userFeedEntrySchema);




var express = require('express');
var router = express.Router();
var _stormpath = undefined;
var passwordValidator = require('password-validator');
var validator = require('validator');



exports.addAPIRouter = function (app, mongoose, stormpath) {
    _stormpath = stormpath;

    app.get('/*', function (req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.post('/*', function (req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.put('/*', function (req, res, next) {
        res.contentType('application/json');
        next();
    });
    app.delete('/*', function (req, res, next) {
        res.contentType('application/json');
        next();
    });

    // router.post('/user/enroll', function(req, res) {
    //     res.status(201);
    //     res.contentType('application/json');
    //     res.send(req);
    // })

    // router.get('/feeds', stormpath.apiAuthenticationRequired, function(req, res) {
    //     res.status(200)
    //     res.send();
    // }
    // )
    // router.put('/feeds/subscribe', 
    //           stormpath.apiAuthenticationRequired, function(req, res) {
    //     res.status(200);
    //     res.send();

    // })

    app.use('/api/v1.0', router);
}
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json();
var schema = new passwordValidator()
    schema
    .min(8, 'Password requires minimum 8 characters')
    .has().uppercase(1, 'Password requires at least 1 uppercase character')
    .has().lowercase(1, 'Password requires at least 1 lowercase character')
    .has().digits(1, 'Password requires at least 1 number character')

router.post('/user/enroll', jsonParser, async (req, res) => {
    var results = await UserModel.find({ 'email': req.body.email });
    var pw = schema.validate(req.body.password);
    console.log(pw);

    if (req.body.firstName === undefined) {
        errStr = "Undefined First Name";
        res.status(400);
        res.json({ error: errStr });
    }
    else if (req.body.lastName === undefined) {
        errStr = "Undefined Last Name";
        res.status(400);
        res.json({ error: errStr });
    }
    else if (req.body.email === undefined) {
        errStr = "Undefined Email";
        res.status(400);
        res.json({ error: errStr });
    }
    else if (!validator.isEmail(req.body.email)) {
        errStr = "Invalid email format";
        res.status(400);
        res.json({ error: errStr });
        console.log("coming");

    }
    else if (pw === false) {
        errStr = "Invalid Password format";
        res.status(400);
        res.json({ error: errStr });
        console.log("coming");
    }
    else if (results.length > 0) {
        res.status(400).json({ error: 'Account with that email already exists.  Please choose another email.' })
    }
    else {
        var newUser = new UserModel(
            {
                active: true,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password,
            }
        );
        try {
            const save = await newUser.save();
            console.log(save);
            res.status(201).json({
                'firstName': save.firstName,
                'lastName': save.lastName,
                'email': save.email,
                'password': save.password
            });
        }
        catch (err) {
            res.status(500);
            res.json({ error: err });
        }
    }


});

var feedsdata = { feeds : [] };
router.get('/feeds', async (req, res)=>{
    var results = await FeedModel.find();
    res.status(201);
    feedsdata.feeds = results;
    res.json(feedsdata);
});



router.put('/feeds/subscribe' ,jsonParser , async(req ,res)=>{
    var user = await UserModel.find({'email': req.body.email})
    var feedmod = new FeedModel({'feedURL' : req.body.feedURL});
    try {
        const feed = await feedmod.save();
        console.log(feed._id, user._id);
        var uu = user[0];
        uu.subs.addToSet(feed._id);
        var result = await uu.save();
            res.status(201).json(result);
    }
    catch (err) {
        res.status(500);
        console.log(err);
        res.json({ error: err });
    }
})
