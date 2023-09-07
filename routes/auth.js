const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');


/*==================================
 *       Configure Strategy
 *==================================
 * The messages declared here are stored in an array 'messages' in session object.
 * But this array is not cleared as long as session exists.
 * This results in old messages still being displayed on login page. 
 * 
 * Using express-flash is the solution here. Refer to pd_ver2 project.
 */

const strategy = new LocalStrategy(
    async (username, password, done)=>{
        
        const found = await User.findOne({username: username})
        if(found === null) { return done(null, false, {message: 'User does not exist.'}); }     //no user found
        
        const result = await bcrypt.compare(password, found.hash);
        if(result === false) { return done(null, false, {message: 'Incorrect password.'}); } //wrong password

        return done(null, found); //all good
    }
);

passport.use(strategy);




/*==========================================
 *       Serialize and Deserialize User
 *==========================================
 */

passport.serializeUser((user, cb)=>{
    process.nextTick(()=>{
        cb(null, { id: user.id, username: user.username });      // somehow passport stores the found data when strategy is used
    });
});

passport.deserializeUser((user, cb)=>{
    process.nextTick(()=>{
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
        res.render('login', {msg: req.session.messages ? req.session.messages.slice(-1): '' });        //else show login page
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
        async function createUser(){
            const found = await User.findOne({username: req.body.username});
            if(found !== null) { return res.render('error', {msg: 'A user already exists with that username.'}); }

            const hash = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                hash: hash
            });
            await newUser.save();
            res.redirect('/login');
        }
        
        try{
            createUser();
        }catch(err){
            res.send(err);
        }
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

router.post('/changepassword', (req, res)=>{
    async function changePassword(){
        const found = await User.findOne({_id: req.session.passport.user.id});
        if(found === null) { return res.render('error', {msg: 'User does not exist anymore.'})}
        
        const hash = await bcrypt.hash(req.body.newPassword, 10);
        found.hash = hash;
        await found.save();
        res.render('passupdated');
    }
    
    if(req.isAuthenticated()){
        try{
            changePassword();
        }catch(err){
            console.log(err);
        }
    }
})


module.exports = router;