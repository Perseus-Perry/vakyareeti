//jshint esversion:6

const randkey = require('random-keygen');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const http = require('http').Server(app);
const Jimp = require('jimp');
const server = require('http').createServer(app);
const io = require('socket.io')(http);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(session({
    secret: "kjbdf23bedsni322j5h643nbthj5bkrn3",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const postsDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Posts?retryWrites=true/postsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const usersDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Users?retryWrites=true/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postVotesDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Votes?retryWrites=true/postVotesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var usersSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    followers: Array,
    following: Array,
    posts: Array
});

var postSchema = mongoose.Schema({
    _id: String,
    username: String,
    image: String,
    title: String,
    body: String,
    votes: Number
}, {
    timestamps: true
});

var postVotesSchema = mongoose.Schema({
    _id: String,
    likeCount: Number,
    dislikeCount: Number,
    likes: Array,
    dislikes: Array
});

mongoose.plugin(passportLocalMongoose);


var User = usersDB.model("User", usersSchema);
var Post = postsDB.model("Post", postSchema);
var PostVotes = postVotesDB.model("PostVote", postVotesSchema);
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function (req, res) {
    if(req.isAuthenticated()) {
        var currentUser = req.user.username;
        var success = true;
        var postsToRender = [];
        User.findOne({
            username: currentUser
        }, function (err, user) {

            if(err) {
                console.log(err);
            } else {
                    Post.find({
                        username: user.following
                    }, function (err, posts) {
                        if(err) {
                            console.log(err);
                        } else {
                            res.render("feed",{posts:posts})
                        }
                    })

                }

        })

        if(!success) {
            res.send("<h1>Error while loading the posts</h1>")
        }
    } else {
        res.redirect('/authenticate');
    }
});


function renderFeed(res, posts) {
    console.log(posts)
    res.render('feed', {
        posts: posts
    });
}

app.get("/explore", function (req, res) {

    if(req.isAuthenticated()) {

        var success = true;
        Post.find({}, function (err, posts) {
            if(err) {
                console.log(err);
                success = false;
            } else {
                res.render("explore", {
                    posts: posts
                });
            }
        });

        if(!success) {
            res.send("<h1>Error while loading the posts</h1>")
        }
    } else {
        res.redirect('/authenticate');
    }

});


app.get("/compose", function (req, res) {
    if(!req.isAuthenticated()) {
        res.redirect('/authenticate')
    } else {
        res.render("compose");
    }
});


app.get("/post/:postID", function (req, res) {
    var postToLookFor = req.params.postID;
    Post.findOne({
        _id: postToLookFor
    }, function (err, post) {
        if(err) {
            console.log(err);
        } else {
            if(post === null) {
                res.send(" <h1> Can't find post</h1>");
            } else {
                res.render("post", {
                    currentUser: req.user.username,
                    id: post._id,
                    username: post.username,
                    title: post.title,
                    body: post.body,
                    votes: post.votes
                });
            }
        }
    });
});

app.get("/user/:user", function (req, res) {
    var userToLookFor = req.params.user;
    User.findOne({
        username: userToLookFor
    }, function (err, user) {
        if(err) {
            console.log(err);
        } else {
            if(user === null) {
                res.send("<h1>Can't find user</h1>");
            } else {
                var isFollowed = true;
                if(user.followers.includes(req.user.username)) {
                    isFollowed = true;
                } else {
                    isFollowed = false;
                }
                res.render("user", {
                    followed: isFollowed,
                    currentUser: req.user.username,
                    name: user.name,
                    username: user.username
                })
            }
        }
    })
})


app.get("/authenticate", function (req, res) {

    if(req.isAuthenticated()) {
        res.redirect("/")
    } else {
        res.render("authenticate");
    }
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/register', function (req, res) {
    User.register({
            name: req.body.name,
            email: req.body.remail,
            username: req.body.username,
            followers: [],
            following: []
        },
        password = req.body.password,
        function (err, result) {
            if(err) {
                console.log(err)
                res.redirect('/authenticate')
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect("/")
                })
            }
        })
});

app.get("/admin", function (req, res) {
    res.render("admin", {
        posts: {
            _id: "7WmRfK",
            username: "naruto1715",
            title: "Validators",
            body: "Dates have two built-in validators: min and max. These validators will...",
            createdAt: '2020 - 05 - 06 T18: 01: 32.100 + 00: 00',
            updatedAt: '2020 - 05 - 06 T18: 01: 32.100 + 00: 00'
        }
    })
})

app.post("/admin", function (req, res) {
    var searched = req.body.searchQuery;
    if(req.body.optradio === "author") {
        Post.find({
            username: searched
        }, function (err, docs) {
            if(err) {
                console.log(err)
                res.send("<h1>error</h1>");
            } else {
                res.render("admin", {
                    posts: docs
                })
            }
        })
    } else {
        Post.find({
            title: searched
        }, function (err, docs) {
            if(err) {
                console.log(err)
                res.send("<h1>error</h1>");
            } else {
                res.render("admin", {
                    posts: docs
                })
            }
        })

    }
})

app.post('/login', function (req, res) {



    const user = new User({
        username: req.body.username,
        password: req.body.password
    });



    req.login(user, function (err) {
        if(err) {
            console.log(err)
        } else {
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/authenticate'
            })(req, res, function () {
                res.redirect("/")
            });
        }
    })

})

app.post("/compose", function (req, res) {
    if(!req.isAuthenticated()) {
        res.redirect("/")
    } else {
        const currentUser = req.user;
        var key = randkey.get({
            length: 6,
            numbers: true
        });
        User.findOne({
            username: req.user.username
        }, function (err, user) {
            if(err) {
                console.log(err);
            } else {
                user.posts.push(key);
                user.save();
            }
        })
        var post = new Post({
            _id: key,
            username: currentUser.username,
            image: req.body.image,
            title: req.body.title,
            body: req.body.post,
            votes: 0
        });
        var postVote = new PostVotes({
            _id: key,
            likeCount: 0,
            dislikeCount: 0,
            likes: [],
            dislikes: []
        })

        post.save();
        postVote.save();

        res.redirect('/');
    }
})


app.post("/remove/:postID", function (req, res) {
    Post.findOne({
        _id: req.params.postID
    }, function (err, result) {
        if(err) {
            console.log(err)
        } else {
            if(result === null) {
                res.redirect('/')
            } else {
                Post.deleteOne({
                    _id: req.params.postID
                }, function (err) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.redirect("/");
                    }
                });
            }
        }
    });
})

io.on('connection', function (socket) {
    socket.on('upvote', (id) => {
        Post.findOne({
            _id: id
        }, function (err, doc) {
            if(err) {
                console.log(err)
            } else {
                doc.votes += 1;
                doc.save();
            }
        })
    });
    socket.on('downvote', (id) => {
        Post.findOne({
            _id: id
        }, function (err, doc) {
            if(err) {
                console.log(err)
            } else {
                doc.votes -= 1;
                doc.save();
            }
        })
    });
    socket.on('follow', (data) => {
        User.findOne({
            username: data.username
        }, function (err, user) {
            if(err) {
                console.log(err)
            } else {

                user.followers.push(data.currentUser);
                user.save();
            }
        })
        User.findOne({
            username: data.currentUser
        }, function (err, user) {
            if(err) {
                console.log(err)
            } else {

                user.following.push(data.username);
                user.save();
            }
        })
    })

    socket.on('unfollow', (data) => {
        User.findOne({
            username: data.username
        }, function (err, user) {
            if(err) {
                console.log(err)
            } else {

                user.followers.remove(data.currentUser);
                user.save();
            }
        })
    })
})

http.listen(process.env.PORT || 3000, function () {
    console.log("Server started");
});
