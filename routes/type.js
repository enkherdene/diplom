const express = require('express');
const router = express.Router();
const AdSubtype= require("../models/ad_subtype");
const Ad = require("../models/advertisement");
const AdType=require("../models/ad_type");

router.get('/:id',function(req,res){
    AdSubtype.findAll({
        where:{
            status:1,
            ad_typeid: req.params.id
        }
    }).then(subtypes=>{
        Ad.findAll({
            where:{
                status:1,
                ad_type:req.params.id
            }
        }).then(ads=>{
            AdType.findAll().then(types=>{
                req.session.menu_types=types;
                res.render('type-index', {
                    title: '',
                    article: ads,
                    menu_types: types,
                    menu_subtypes: subtypes,
                    errors:''
                    
                });
            });
        });
    })
})




module.exports = router;