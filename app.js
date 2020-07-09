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
const mobile = require('is-mobile');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }

));
app.use(express.static("public"));

app.use(session({
    secret: "kjbdf23bedsni322j5h643nbthj5bkrn3",
    resave: false,
    saveUninitialized: false
  }

));
app.use(passport.initialize());
app.use(passport.session());
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const postsDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Posts?retryWrites=true/postsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

);

const usersDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Users?retryWrites=true/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

);

const postVotesDB = mongoose.createConnection("mongodb+srv://admin-rohan:hokjvhJL3OG0mRWb@vakyareeti-cluster0-gv8rz.mongodb.net/Votes?retryWrites=true/postVotesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

);



var usersSchema = mongoose.Schema({
    name: String,
    username: String,
    bio: String,
    profilePic: String,
    email: String,
    followers: Array,
    following: Array,
    posts: Array,
    savedPosts: Array
  }

);

var postSchema = mongoose.Schema({
    _id: String,
    username: String,
    image: String,
    title: String,
    body: String,
    votes: Number,
    seriesID: String
  }

  , {
    timestamps: true
  }

);

var postVotesSchema = mongoose.Schema({
    _id: String,
    likeCount: Number,
    dislikeCount: Number,
    likes: Array,
    dislikes: Array
  });

var seriesSchema = mongoose.Schema({
  seriesName: String,
  creatorName: String,
  creatorUserName: String,
  postIDs: Array,
  postTitles: Array
});


mongoose.plugin(passportLocalMongoose);


var User = usersDB.model("User", usersSchema);
var Post = postsDB.model("Post", postSchema);
var Series = postsDB.model("Series", seriesSchema);
var PostVotes = postVotesDB.model("PostVote", postVotesSchema);
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res) {


    var success = true;

    Post.find({}

    ).sort('-createdAt').exec(function(err, posts) {
        if(err) {
          console.log(err);
          success = false;
        } else {

          if(typeof req.user !== 'undefined') {
            res.render("feed", {
                currentUser: req.user.username,
                posts: posts,
                isMobile: mobile()
              }

            );
          } else {
            res.render("feed", {
                currentUser: "",
                posts: posts,
                isMobile: mobile()
              }

            );
          }

        }
      }

    );

    if(!success) {
      res.send("<h1>Error while loading the posts</h1>")
    }

  }

);



app.get("/explore", function(req, res) {

    if(req.isAuthenticated()) {

      var success = true;

      Post.find({}

      ).sort('-createdAt').exec(function(err, posts) {
          if(err) {
            console.log(err);
            success = false;
          } else {
            res.render("explore", {
                posts: posts
              }

            );
          }
        }

      );

      if(!success) {
        res.send("<h1>Error while loading the posts</h1>")
      }
    } else {
      res.redirect('/authenticate');
    }

  }

);

app.get('/account', function(req, res) {
    if(!req.isAuthenticated()) {
      res.redirect("/authenticate");
    } else {
      User.findOne({username:req.user.username},function (err,doc){
        if(err){
          console.log(err);
        }
        else{
          console.log(doc)
          res.render('account',{currentUser:req.user.username,
            url:doc.profilePic,
            bio:doc.bio});
        }
      })    }
  }

)

app.get("/compose", function(req, res) {
    if(!req.isAuthenticated()) {
      res.redirect('/authenticate')
    } else {
      Series.find({})
     .then((data)=>{
        console.log(data);
      });
      res.render("compose",{
          currentUser: req.user.username
        }
      );
    }
  }

);

app.post("/update-picture/" , function(req,res){
  if(!req.isAuthenticated()) {
    res.redirect('/authenticate')
  } else {
     var new_url = req.body.url;
     User.findOne({username:req.user.username},function(err,doc){
       if(err){
         console.log(err)
       }
       else{
         doc.profilePic = new_url;
         doc.save();
         res.redirect('/account')
       }
     })
  }
})

app.post('/update-bio',function(req,res){
  if(!req.isAuthenticated()) {
    res.redirect('/authenticate')
  }
  else{
    var new_bio = req.body.bio;
    User.findOne({username:req.user.username},function(err,doc){
      if(err){
        console.log(err)
      }
      else{
        doc.bio = new_bio;
        doc.save();
        res.redirect('/account')
      }
    })
  }
})

app.get("/saved", function(req, res) {
    if(!req.isAuthenticated()) {

      res.redirect('/authenticate')
    } else {
      User.findOne({
          username: req.user.username
        }

        ,
        function(err, user) {
          if(err) {
            console.log(err);
          } else {
            Post.find({
                _id: user.savedPosts
              }

              ,
              function(err, docs) {
                if(err) {
                  console.log(err);
                } else {
                  res.render("saved", {
                      posts: docs,
                      currentUser: req.user.username,
                      isMobile: mobile()
                    }

                  );
                }
              }

            )
          }
        }

      )
    }
  }

)

app.get("/post/:postID", function(req, res) {

    var postToLookFor = req.params.postID;

    Post.findOne({
        _id: postToLookFor
      }

      ,
      function(err, post) {
        if(err) {
          console.log(err);
        } else {
          if(post === null) {
            res.send(" <h1> Can't find post</h1>");
          } else {
            if(req.isAuthenticated()) {
              res.render("post", {
                  currentUser: req.user.username,
                  id: post._id,
                  username: post.username,
                  title: post.title,
                  body: post.body,
                  votes: post.votes,
                  createdAt: post.createdAt,
                  isMobile: mobile()
                }

              );
            } else {
              res.render("post", {
                  currentUser: "",
                  id: post._id,
                  username: post.username,
                  title: post.title,
                  body: post.body,
                  votes: post.votes,
                  createdAt: post.createdAt,
                  isMobile: mobile()
                }

              );
            }
          }
        }
      }

    );

  }

);

app.get("/user/:user", function(req, res) {
    var userToLookFor = req.params.user;
    var currentUser;

    if(req.isAuthenticated()) {
      currentUser = req.user.username;
    } else {
      currentUser = '';
    }

    User.findOne({
        username: userToLookFor
      }

      ,
      function(err, user) {
        if(err) {
          console.log(err);
        } else {
          if(user === null) {
            res.send("<h1>Can't find user</h1>");
          } else {
            var isFollowed = true;

            if(user.followers.includes(currentUser)) {
              isFollowed = true;
            } else {
              isFollowed = false;
            }

            Post.find({
                username: userToLookFor
              }

              ,
              function(err, posts) {

                res.render("user", {
                    followed: isFollowed,
                    currentUser: currentUser,
                    name: user.name,
                    username: user.username,
                    profilePic : user.profilePic,
                    bio : user.bio,
                    posts: posts
                  }

                )
              }

            )
          }
        }
      }

    )
  }

)

app.get("/authenticate", function(req, res) {

    if(req.isAuthenticated()) {
      res.redirect("/")
    } else {
      res.render("authenticate");
    }
  }

)

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  }

);

app.post('/register', function(req, res) {

      User.register({
          name: req.body.name,
          email: req.body.remail,
          username: req.body.username,
          bio: "",
          profilePic: "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
          followers: [],
          following: [],
          posts: [],
          saved: []
        }

        ,
        password = req.body.password,
        function(err, result) {
          if(err) {
            console.log(err)
            res.redirect('/authenticate')
          } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect("/")
              }

            )
          }

        }

      )

    })

    app.get("/admin", function(req, res) {
        res.render("admin/search", )
      }

    )

    app.get("/admin-invite", function(req, res) {
        Code.find({}

          ,
          function(err, docs) {
            if(err) {
              console.log(err);
            } else {
              console.log(docs);

              res.render("admin/invite", {
                  codes: docs
                }

              )
            }
          }

        )
      }

    )

    app.get("/admin-post", function(req, res) {
        res.render('admin/post')
      }

    )

    app.get("/message", function(req, res) {
        if(!req.isAuthenticated()) {

          res.redirect('/authenticate')
        } else {
          res.render("message", {
              currentUser: req.user.username
            }

          );
        }
      }

    )

    app.get('/revoke/:code', function(req, res) {
        var codeToRemove = req.params.code;

        Code.deleteOne({
            code: codeToRemove
          }

          ,
          function(err) {
            if(err) {
              console.log(err);
            } else {
              res.redirect("/admin-invite")
            }
          }

        )
      }

    )

    app.post("/admin-search", function(req, res) {
        var searched = req.body.searchQuery;

        if(req.body.optradio === "author") {
          if(searched === "") {
            Post.find({}

              ,
              function(err, docs) {
                if(err) {
                  console.log(err)
                  res.send("<h1>error</h1>");
                } else {
                  res.render("admin", {
                      posts: docs
                    }

                  )
                }
              }

            )
          } else {
            Post.find({
                username: searched
              }

              ,
              function(err, docs) {
                if(err) {
                  console.log(err)
                  res.send("<h1>error</h1>");
                } else {
                  res.render("admin", {
                      posts: docs
                    }

                  )
                }
              }

            )
          }
        } else {
          if(searched === "") {
            Post.find({}

              ,
              function(err, docs) {
                if(err) {
                  console.log(err)
                  res.send("<h1>error</h1>");
                } else {
                  res.render("admin", {
                      posts: docs
                    }

                  )
                }
              }

            )
          } else {
            Post.find({
                title: searched
              }

              ,
              function(err, docs) {
                if(err) {
                  console.log(err)
                  res.send("<h1>error</h1>");
                } else {
                  res.render("admin", {
                      posts: docs
                    }

                  )
                }
              }

            )
          }
        }
      }

    )

    app.post("/admin-invite", function(req, res) {
        Code.find({}

          ,
          function(err, docs) {
            if(err) {
              console.log(err);
            } else {
              console.log(docs);

              res.render("admin/invite", {
                  codes: docs
                }

              )
            }
          }

        )
      }

    )

    app.post('/login', function(req, res) {



        const user = new User({
            username: req.body.username,
            password: req.body.password
          }

        );



        req.login(user, function(err) {
            if(err) {
              console.log(err)
            } else {
              passport.authenticate('local', {
                  successRedirect: '/',
                  failureRedirect: '/authenticate'
                }

              )(req, res, function() {
                  res.redirect("/")
                }

              );
            }
          }

        )
      }

    )

    app.post("/compose", function(req, res) {
        if(!req.isAuthenticated()) {
          res.redirect("/")
        } else {
          const currentUser = req.user;

          var key = randkey.get({
              length: 6,
              numbers: true
            }

          );

          User.findOne({
              username: req.user.username
            }

            ,
            function(err, user) {
              if(err) {
                console.log(err);
              } else {
                user.posts.push(key);
                user.save();
              }
            }

          )
          var post = new Post({
              _id: key,
              username: currentUser.username,
              image: req.body.image,
              title: req.body.title,
              body: req.body.post,
              votes: 0
            }

          );

          var postVote = new PostVotes({
              _id: key,
              likeCount: 0,
              dislikeCount: 0,
              likes: [],
              dislikes: []
            }

          )
          post.save();
          postVote.save();

          res.redirect('/');
        }
      }

    )


    app.post("/admin-post", function(req, res) {

        if(req.body.userExists) {
          var key = randkey.get({
              length: 6,
              numbers: true
            });

          User.findOne({
              username: req.body.username
            }

            ,
            function(err, user) {
              if(err) {
                console.log(err);
              } else {
                user.posts.push(key);
                user.save();
              }
            }

          )
        }

        var post = new Post({
            _id: key,
            username: req.body.username,
            image: '',
            title: req.body.title,
            body: req.body.post,
            votes: 0
          }

        );

        var postVote = new PostVotes({
            _id: key,
            likeCount: 0,
            dislikeCount: 0,
            likes: [],
            dislikes: []
          }

        )
        post.save();
        postVote.save();

        res.redirect('/');

      }

    )

    app.post("/save/:postID", function(req, res) {

        var currentUser = req.user.username;

        User.findOne({
            username: currentUser
          }

          ,
          function(err, user) {
            if(err) {
              console.log(err);
            } else {
              user.savedPosts.push(req.params.postID);
              user.save();
            }

            res.status(204).send();
          }

        )
      }

    )

    app.post("/remove/:postID", function(req, res) {
        Post.findOne({
            _id: req.params.postID
          },
          function(err, result) {
            if(err) {console.log(err)}
            else {
              if(result === null) {
                res.redirect('/')
              } else {
                Post.deleteOne({
                    _id: req.params.postID
                  },
                  function(err) {
                    if(err) {console.log(err);}
                       else {res.redirect("/");}
                  })
              }
            }
          }
        );});

    app.post("/newSeries", function(req, res){
      var series = new Series({
        seriesName: req.body.seriesName,
        creatorName: req.user.name,
        creatorUserName: req.user.username,
        postIDs: {},
        postTitles: {}
      });
      series.save();

    });

    io.on('connection', function(socket) {
        socket.on('upvote', (id) => {
            Post.findOne({
                _id: id
              }

              ,
              function(err, doc) {
                if(err) {
                  console.log(err)
                } else {
                  doc.votes += 1;
                  doc.save();
                }
              }

            )
          }

        );

        socket.on('downvote', (id) => {
            Post.findOne({
                _id: id
              }

              ,
              function(err, doc) {
                if(err) {
                  console.log(err)
                } else {
                  doc.votes -= 1;
                  doc.save();
                }
              }

            )
          }

        );

        socket.on('follow', (data) => {
            User.findOne({
                username: data.username
              }

              ,
              function(err, user) {
                if(err) {
                  console.log(err)
                } else {

                  user.followers.push(data.currentUser);
                  user.save();
                }
              }

            )

            User.findOne({
                username: data.currentUser
              }

              ,
              function(err, user) {
                if(err) {
                  console.log(err)
                } else {

                  user.following.push(data.username);
                  user.save();
                }
              }

            );

            socket.emit('status', {
                username: data.username,
                currentUser: data.currentUser
              }

            );
          }

        )

        socket.on('unfollow', (data) => {
            User.findOne({
                username: data.username
              }

              ,
              function(err, user) {
                if(err) {
                  console.log(err)
                } else {

                  user.followers.remove(data.currentUser);
                  user.save();
                }
              }

            )

            User.findOne({
                username: data.currentUser
              }

              ,
              function(err, user) {
                if(err) {
                  console.log(err)
                } else {

                  user.following.remove(data.username);
                  user.save();
                }
              }

            );

            socket.emit('status', {
                username: data.username,
                currentUser: data.currentUser
              }

            );

          }

        )

        socket.on('generate', (data) => {
            var key = randkey.get({
                length: 6,
                numbers: true
              }

            );

            var code = new Code({
                code: key
              }

            );

            code.save();
            var destination = '/admin-invite';
            socket.emit('redirect', destination);
          }

        )
      }

    )

    http.listen(process.env.PORT || 3001, function() {
        console.log("Server started");
      }

    );
