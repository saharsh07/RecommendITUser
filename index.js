const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./database/connection');


dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 4000
app.use(express.static('public'))
app.set('view engine', 'ejs')

//model:
const ProductItem = require('./models/productItem')

// mongodb connection
connectDB();

var flag = 0;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
//modules require for authentication
let session = require("express-session");
let passport = require("passport");
let passportLocal = require("passport-local");
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

app.use(session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false
}));
app.use(flash());//maintains error message

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport user config

//create user model instance
let userModel = require('./models/login');
let User = userModel.User;

//Strategy 
passport.use(User.createStrategy());

//serialize and deserialize User info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/logout', requireAuth, (req, res, next) => {
    req.logOut();
    res.redirect('/login');
});
app.get('/', (req, res, next) => {
    ProductItem.find()
    .then(result => {
        const productData = result
        const randomData = productData.sort(() => .5 - Math.random()).slice(0, 6)
        console.log(req.user);
        res.render('index',{ productData, randomData, displayName:req.user?req.user.username:'' })
    })
    .catch(err => console.log(err))
    
});
app.get('/login', (req, res, next) => {
    console.log("in login");
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage')
        });
    } else {
        return res.redirect('/');
    }
});
//Get Route for displaying the Register page 
app.get('/register', (req, res, next) => {
    //if user not already logged in
    if (!req.user) {
        console.log('in process register...controller');
        res.render('register',
            {
                messages: req.flash('registerMessage')
            }
        );

    } else {
        //if user does exist
        return res.redirect('/login');
    }
});

//POST route for processing the Register page 
app.post('/register', (req, res, next) => {
    //initate user object
    console.log('in process register...controller');
    console.log(req.body);
    let newUser = User(
        {// password:req.body.password
            username:req.body.username,
            email: req.body.email   
        }
    );
    User.register(newUser, req.body.password, (err) => {

        if (err) {
            console.log("error inserting user"+err.name);
            if (err.name == "UserExistsError") {
                req.flash(
                    'registerMessage',
                    'Registeration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists! ');
            }
            return res.render('register', {
                messages: req.flash('registerMessage')
            });
        } else {
            //if no error exists
            //so registeration is successful

            //redirect the user and authenticate them 
            console.log('in else');
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/login');
            });
        }
    })


});

app.post('/login', (req, res, next) => {

    passport.authenticate('local',
        (err, user, info) => {
            if (err) {
                return next(err);
            }
            // is there user login error?
            if (!user) {
                req.flash('loginMessage', 'Authentication Error');
                return res.redirect('/login');
            }
            req.login(user, (err) => {
                //server error
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            })
        })(req, res, next);
});


function requireAuth(req, res, next) {
    //User is logged in?
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    ProductItem.find()
    .then(result => {
        res.render('index', {productData: result, displayName:req.user?req.user.username:'' })
    })
    .catch(err => console.log(err))
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/details/:productId', (req, res) => {
    console.log('req.params.productId', req.params.productId);
    // res.end()
    ProductItem.findById(req.params.productId)
  .then((result) => {
    //   res.send(result)
      res.render('details', {product: result,displayName:req.user?req.user.username:'' })
  })
  .catch(err => console.log(err))
})



//less than$30 Page
app.get('/lessThan1500', (req, res) => {
    ProductItem.find({"price": { "$lt":"1500" }})
    // console.log("resultados:", resultados)
    .then(result => {
        console.log(result);
        res.render('lessThan1500', {cheapData: result, displayName:req.user?req.user.username:'' })
    })
    .catch(err => console.log(err))
})

//Weekly Recommendations
app.get('/weekly', (req, res) => {
    ProductItem.find()
    .then(result => {
        const weeklyData = result.sort(() => .5 - Math.random()).slice(0,3)
    res.render('weekly', {weeklyData, displayName:req.user?req.user.username:'' })
    })
    .catch(err => console.log(err))
})


app.use((req, res) => {
    res.status(404).render('404')
})

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});