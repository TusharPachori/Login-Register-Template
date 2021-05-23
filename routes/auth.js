var express = require('express');
var router = express.Router();
var passport = require('passport');
const user = require('../models/user');


router.route('/login')
    .get(function(req, res, next){
        res.render('login', { title: 'Login your account' });
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
    }), function(req, res){
        res.redirect('/')
    });

router.route('/register')
    .get(function(req, res, next){
        res.render('register', { title: 'Register a new account' });
    })
    .post(function(req, res, next){
        req.checkBody('name', 'Empty Name').notEmpty();
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'Empty Password').notEmpty();
        req.checkBody('password', 'Passwor do not match').equals(req.body.confirmPassword);

        req.getValidationResult().then(function(result){
            if(result.array().length){
                console.log(result.array());
                res.render('register', {
                    name: req.body.name,
                    email: req.body.email,
                    errorMessages: result.array()
                });
            }else{
                var user = new User();
                user.name = req.body.name;
                user.email = req.body.email;
                user.setPassword(req.body.password);
                console.log(user)
                user.save(function(err){
                    if(err){
                        console.log(err)
                        res.render('register', {
                            name: req.body.name,
                            email: req.body.email,
                            errorMessages: err
                        });
                    }else{
                        res.redirect('/login');
                    }
                });
            }
        })
    });

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/')
})

module.exports = router;