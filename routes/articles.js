var express = require('express');
var router = express.Router();

const db= require('../db');
const Ad = require("../models/advertisement");
const User=require("../models/user");
const AdSubtype= require("../models/ad_subtype");
const DurationType= require("../models/duration_type");
const Freelancer= require("../models/freelancer");

//зар нэмэх
router.get('/add',ensureAuth, function(req,res){
    AdSubtype.findAll({
        where:{
            status:1
        }
    }).then(subtypes=>{
        DurationType.findAll().then(d_types=>{
            res.render('add', {
                title: 'Зар оруулах хүснэгт',
                subtypes:subtypes,
                d_types:d_types,
                errors:''
               
            });

        })
    }) 

});

router.post('/add', ensureAuth, function(req, res){
req.checkBody('name','Гарчиг хоосон байна').notEmpty();
//req.checkBody('image','Зураг хоосон байна').notEmpty();
req.checkBody('ad_subtype','Төрөл хоосон байна').notEmpty();
req.checkBody('price','Үнэ хоосон байна').notEmpty();

let errors =req.validationErrors();

if(errors){
        AdSubtype.findAll({
            where:{
                status:1
            }
        }).then(subtypes=>{
            DurationType.findAll().then(d_types=>{
                res.render('add', {
                    title: 'Зар оруулах хүснэгт',
                    subtypes:subtypes,
                    d_types:d_types,
                    errors:errors
                   
                });

            })
        })
}else{
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        AdSubtype.findOne({
            where:{
                id:req.body.ad_subtype
            }
        }).then(subtype=>{
            const today=new Date();
            const adData = {
                name:  req.body.name,
                about:  req.body.about,
                image:  '',
                price:  req.body.price,
                duration:  req.body.duration,
                duration_type:  req.body.duration_type,
                freelancer_id: user.id,
                ad_type:  subtype.ad_typeid,
                ad_subtype:  req.body.ad_subtype,
                start_date:  today,
            }
            if(req.files){
                var fileExtension = req.files.image.mimetype.split('/')[1];
                var file =req.files.image,
                    image=user.email+adData.price+'.'+fileExtension;
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
                    file.mv("./public/upload/"+image,function(err){
                        if(err){
                            console.log(err);
                            AdSubtype.findAll({
                                where:{
                                    status:1
                                }
                            }).then(subtypes=>{
                                DurationType.findAll().then(d_types=>{
                                    res.render('add', {
                                        title: 'Зар оруулах хүснэгт',
                                        subtypes:subtypes,
                                        d_types:d_types,
                                        errors:'',
                                           
                                    });
                        
                                })
                            })
                        }else{
                                adData.image=image;
                                console.log(adData);
                                Ad.create(adData);
                                res.redirect('/');
                            }
                        })      
                }
                    
            }else{
                console.log(adData);
                Ad.create(adData);
                res.redirect('/');
            }
           
        })
    })
    .catch(err => {
        console.log(err);
        return;
    })

}

return;
});

//тухайн зарын мэдээлэл гаргах 
router.get('/:id', function(req,res){
    Ad.findOne({
        where:{
        id:req.params.id
        }
    }).then(ad=>{
        Freelancer.findOne({
            where:{
                id:ad.freelancer_id
            }
        }).then(user=>{
            res.render('article', {
                title: 'Зар',
                article: ad,
                auther:user,
                errors:''
            });
        })
        
    })
    .catch(err => {
        res.send('error: ' + err)
    })
});

 //тухайн сонгосон зарын мэдээлэл засварлах
router.get('/edit/:id',ensureAuth, function(req,res){
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        if(user){
            Ad.findOne({
                where:{
                id:req.params.id
                }
            }).then(ad=>{
                if(user.id==ad.freelancer_id){
                    AdSubtype.findAll({
                        where:{
                            status:1
                        }
                    }).then(subtypes=>{
                        DurationType.findAll().then(d_types=>{
                            res.render('edit_article', {
                                title: 'Зарын мэдээлэл засах',
                                subtypes:subtypes,
                                d_types:d_types,
                                article: ad,
                                errors:''
                               
                            });
            
                        })
                    })
                }else{
                    res.redirect('/article/'+ad.id);
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
 });

 router.post('/edit/:id',ensureAuth, function(req, res){
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        AdSubtype.findOne({
            where:{
                id:req.body.ad_subtype
            }
        }).then(subtype=>{
            if(req.files.image==undefined){
                const today=new Date();
                const adData = {
                    name:  req.body.name,
                    about:  req.body.about,
                    price:  req.body.price,
                    duration:  req.body.duration,
                    duration_type:  req.body.duration_type,
                    freelancer_id: user.id,
                    ad_type:  subtype.ad_typeid,
                    ad_subtype:  req.body.ad_subtype,
                    start_date:  today,
                }
                console.log(adData);
                Ad.findOne({
                    where:{
                        id:req.params.id
                    }
                }).then(adver=>{
                    adver.update(adData);
                    res.redirect('/');
                })

                
                    
            }else{
                const today=new Date();
                const adData = {
                    name:  req.body.name,
                    about:  req.body.about,
                    image:  req.files.image,
                    price:  req.body.price,
                    duration:  req.body.duration,
                    duration_type:  req.body.duration_type,
                    freelancer_id: user.id,
                    ad_type:  subtype.ad_typeid,
                    ad_subtype:  req.body.ad_subtype,
                    start_date:  today,
                }
                var fileExtension = req.files.image.mimetype.split('/')[1];
                var file =req.files.image,
                    image=user.email+adData.price+'.'+fileExtension;
                if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/gif') {
                    file.mv("./public/upload/"+image,function(err){
                        if(err){
                            console.log(err);
                            AdSubtype.findAll({
                                where:{
                                    status:1
                                }
                            }).then(subtypes=>{
                                DurationType.findAll().then(d_types=>{
                                    res.render('edit_article', {
                                        title: 'Зарын мэдээлэл засах',
                                        subtypes:subtypes,
                                        d_types:d_types,
                                        article: req.body,
                                        errors:''
                                       
                                    });
                        
                                })
                            })
                        }else{
                                adData.image=image;
                                console.log(adData);
                                Ad.findOne({
                                    where:{
                                        id:req.params.id
                                    }
                                }).then(adver=>{
                                    adver.update(adData);
                                    res.redirect('/');
                                })
                                
                            }
                        })      
                }
            }
           
        })
    })
    .catch(err => {
        console.log(err);
        return;
    })
    

   // console.log(req.body.title);
    return;
});

 //тухайн сонгосон зарын мэдээлэл устгах
router.get('/delete/:id',function(req,res){
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        if(user){
            Ad.findOne({
                where:{
                id:req.params.id
                }
            }).then(ad=>{
                if(user.id==ad.freelancer_id){
                    let today=new Date();
                    ad.update({
                        status:2,
                        end_date:today
                    }).then(() => {});
                    Ad.findAll({
                        where:{
                            status:1
                        }
                    }).then(ads=>{
                        res.render('index', {
                            title: 'Зарын мэдээлэл',
                            article: ads,
                            errors:''
                            
                        });
                    });
                }else{
                    res.redirect('/article/'+ad.id);
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
    
});
 //хэрэглэгч нэвтэрсэн эсэх шалгах
function ensureAuth(req, res, next){
    if(req.session.user){
        return next();
    }else{
        req.flash('danger', 'Нэвтэрч орно уу');
        res.redirect('/login');
    }
}
module.exports = router;