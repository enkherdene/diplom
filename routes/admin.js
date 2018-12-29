var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const db= require('../db');
const User = require("../models/user");
const Ad = require("../models/advertisement");
const AdType=require("../models/ad_type");
const Freelancer =require("../models/freelancer");

router.get('/',function(req,res){
    res.render('admin',{
        title:'админ хэсэг',
        errors:''
    })
})


module.exports = router;