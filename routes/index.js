const express = require('express');
const bodyParser = require('body-parser');
const {connect, Schema, model} = require('mongoose');
const passport = require('passport');



const router = express.Router();

router.get('/', (req, res)=>{
    console.log(req.session);
    res.render('home');
});

router.get('/views', (req, res)=>{
    req.session.save(function(err){
        if(req.session === undefined) { return res.send('Session does not exist!'); }
        res.send(req.session.id);
    });
});

router.get('/profile', (req, res)=>{
    if(req.isAuthenticated()){
        res.render('profile');
    }else{
        res.status(403).redirect('/login');
    }
});



module.exports = router;