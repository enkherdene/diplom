const express = require('express');
const router = express.Router();

//const db= require('../db');
const User=require("../models/user");
const Freelancer=require("../models/freelancer");



router.get('/register', ensureAuth,function(req,res){
    res.render('register',{
        title:'хувиараа хөдөлмөр эрхлэгчийн бүртгэл',
        errors:''    
    })
})


router.post('/register',ensureAuth, function(req,res){
    req.checkBody('r_number3','Регистр хоосон байна').notEmpty();
    req.checkBody('phone','утасны дугаар хоосон байна').notEmpty();

    let errors =req.validationErrors();
    console.log(req.body);
    console.log(req.session.user);
    console.log(req.files);
    console.log(req.files.image);
    
    if(errors){
        res.render('register',{
            title:'хувиараа хөдөлмөр эрхлэгчийн бүртгэл',
            errors:errors    
        })
    }else{
        User.findOne({
            where:{
                id:req.session.user.id,
                user_type:1
            }
        })
        .then(user=>{
                const today=new Date();
                const userData = {
                    id:user.id,
                    first_name: req.body.firstname,
                    last_name: req.body.lastname,
                    registation_number: req.body.r_number1+req.body.r_number2+req.body.r_number3,
                    email: user.email,
                    sex: req.body.sex,
                    birth_date: req.body.birthday,
                    phone: req.body.phone,
                    image:'',
                    start_date:today
                }
                if(req.files){
                    var fileExtension = req.files.image.mimetype.split('/')[1];
                    var file =req.files.image,
                        image=user.email+'.'+fileExtension;
                    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
                        file.mv("./public/upload/user/"+image,function(err){
                            if(err){
                                console.log(err);
                                res.render('register',{
                                    title:'хувиараа хөдөлмөр эрхлэгчийн бүртгэл',
                                    errors:''    
                                })
                            }else{
                                    userData.image=image;
                                    console.log(userData);
                                    Freelancer.create(userData);
                                    user.update(
                                        { user_type: 2 }, 
                                      );
                                    req.session.user=user;
                                    res.redirect('/');
                                }
                            })      
                    }
                        
                }else{
                    console.log(userData);
                    Freelancer.create(userData);
                    user.update(
                        { user_type: 2 }, 
                      );
                      req.session.user=user;
                    res.redirect('/');
                }
            
            })
        .catch(err => {
            console.log(err);

            res.render('register',{
                title:'хувиараа хөдөлмөр эрхлэгчийн бүртгэл',
                errors:''    
            })
            return;
        })
    }
})
function ensureAuth(req, res, next){
    if(req.session.user){
        return next();
    }else{
        req.flash('danger', 'нэвтэрч орно уу');
        res.render('login',{
            title:'нэвтрэх',
            errors:''    
        })
    }
}
module.exports = router;