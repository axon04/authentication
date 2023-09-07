require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const {connect, Schema, model} = require('mongoose');
const MongoStore = require('connect-mongo');
const session  = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use((req, res, next)=>{
    res.set('Cache-control', 'no-store');
    next();
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'CSID',
    cookie: { path: '/', httpOnly: true, maxAge: 3600000},
    store: MongoStore.create({
        mongoUrl: process.env.DBSTRING,
        ttl: 10*60*60,
    })
}));

app.use(passport.initialize());
app.use(passport.session());

connect(process.env.DBSTRING, {useNewUrlParser: true});

app.use('/', indexRouter);
app.use('/', authRouter);




app.listen(3000, ()=>{
    console.log('PORT: \x1b[94m 3000 \x1b[0m');
    
})