const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');


/*==================================
 *       Configure Strategy
 *==================================
 *
 */


const strategy = new LocalStrategy(
    (username, password, done)=>{
        User.findOne({username: username})
        .then((found)=>{
            if(found === null) { return done(null, false, {message: 'User does not exist.'}); }  //no user found

            bcrypt.compare(password, found.hash)
            .then((result)=>{ 
                if(result === false) { return done(null, false, {message: 'Incorrect password.'}); } //wrong password
                return done(null, found); //all good
            })

        })
        .catch((err)=>{
            return done(err);
        })
    }
);

passport.use(strategy);




/*==========================================
 *       Serialize and Deserialize User
 *==========================================
 */

passport.serializeUser((user, cb)=>{
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username });      // somehow passport stores the found data when strategy is used
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});




/*====================
 *       Routes
 *====================
 */


const router = express.Router();

router.route('/login')
    .get((req, res)=>{
        
        if(req.isAuthenticated()){              //if already logged in, send to profile page
           return res.redirect('/profile');
        }
        
        res.render('login');        //else show login page
    })
    .post(
        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureMessage: true
        })
    );


router.route('/register')
    .get((req, res)=>{
        res.render('register');
    })
    .post((req, res)=>{
        User.findOne({username: req.body.username})
        .then((found)=>{
            if(found !== null) { return res.send('<pre style="font-family: monospace; margin: 1em 0px;">Error: A user already exists with that username.</pre>'); }

            bcrypt.hash(req.body.password, 10)
            .then((hash)=>{
                const newUser = new User({
                    name: req.body.name,
                    username: req.body.username,
                    hash: hash
                });
                newUser.save();
            })
            .then(()=>{ res.status(200).redirect('/login') });
        })
        .catch((err)=>{
            console.log(err);
        })
    });

router.post('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        } else {
            req.session.destroy((err) => {
                if (err) { console.log(err); }
                res.redirect("/login");
            });
        }
    });
});
module.exports = router;