var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const db= require('../db');
const User = require("../models/user");
const Ad = require("../models/advertisement");
const AdType=require("../models/ad_type");

router.get('/', function (req, res) {
    Ad.findAll({
        where:{
            status:1
        }
    }).then(ads=>{
        AdType.findAll().then(types=>{
            req.session.menu_types=types;
            res.render('index', {
                title: '',
                article: ads,
                menu_types: types,
                errors:''
                
            });
        });
    });
});

//бүртгэл
router.get('/signup', function(req,res){
    res.render('signup', {
        title: 'Бүртгэл',
        errors:''
    });
    
});

router.post('/signup', function(req, res){
    req.checkBody('email','Цахим шуудан шалгана уу').notEmpty();
    //req.checkBody('email','Цахим шуудан шалгана уу').isEmail();
    req.checkBody('password','Нууц үг шалгана уу').notEmpty();
    req.checkBody('password2','Нууц үг таарахгүй байна').equals(req.body.password);

    // get error
    let errors =req.validationErrors();

    if(errors){
        res.render('signup',{
            title: 'Бүртгэл',
            errors:errors
        });
        console.log(errors);
    }else{
        const today = new Date()
        const userData = {
            email: req.body.email,
            password: req.body.password,
            user_type: 1,
            start_date: today
        }
        
        User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
                if (!user) {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        userData.password = hash;
                        User.create(userData)
                            .then(user => {
                                req.flash('success','бүртгэгдлээ');
                                res.redirect('/login');
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                } else {
                    req.flash('danger','бүртгэлтэй хэрэглэгч');
                    res.redirect('/signup');
                }
            })
            .catch(err => {
                console.log(err);
                req.flash('danger','алдаа гарлаа');
                res.redirect('/signup');
            })
        
    

    }
});
//нэвтрэх
router.get('/login', function(req,res){
    res.render('login', {
        title: 'Нэвтрэх',
        errors:''
    });
    
});

router.post('/login', function(req, res){
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password,user.password) ) {
                    if(req.body.remember){
                        req.session.cookie.maxAge = 1000 * 60 * 3;
                       }else{
                        req.session.cookie.expires = false;
                       }
                    req.session.user=user;
                    res.redirect('/');
                }else{
                    req.flash('danger','цахим шуудан эсвэл нууц үг буруу байна');
                    res.redirect('/login')
                }
            } else {
                req.flash('danger','цахим шуудан эсвэл нууц үг буруу байна');
                res.redirect('/login')
            }
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })
        


       

});
//системээс гарах
router.get("/logout",function(req,res){    
	req.session.user = null;
	res.redirect("/");
});

//гарчигаар хайлт хийх
router.post("/search", function(req,res){
    AdType.findAll().then(types=>{
        req.session.menu_types=types;
        db.query("SELECT * FROM advertisements WHERE INSTR(name, ?) > 0 AND status=1",[req.body.search], function(err, rows){
            res.render('index', {
                title: '',
                article: rows,
                menu_types: types,
                errors:''
                
            });
        });
    }) 
})


module.exports = router;