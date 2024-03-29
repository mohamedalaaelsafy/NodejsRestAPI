const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');

var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const Client = require('../models/clientSchema');






exports.profile = (req , res , next)=>{
    Client.find({email: req.body.email})
    .exec()
    .then(client=>{
        if(client.length >= 1){
            return res.status(409).json({
                message: 'email has been exist'
            })
                
        }else{
            
            bcrypt.hash(req.body.password , 10 , (err , hash)=>{
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                 
                } else {
                    const client = new Client({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        password: hash,
                        profile_image: req.file.path , 
                        description: req.body.description,
                        phone_number: req.body.phone_number,
                        age: req.body.age,
                        weight: req.body.weight ,
                        length: req.body.length,
                        location: req.body.location,
                        city: req.body.city,
                        heart_beat         : req.body.heart_beat,
                        blood_oxygen       : req.body.blood_oxygen,
                        temprature         : req.body.temprature,
                        blood_pressure     : req.body.blood_oxygen,
                        date               : req.body.date
                       
                    })
                    jwt.sign({client}, 'secretkey', (err , token)=>{
                        if (err) {

                            res.status(409).json({error:err})
                            
                        }
                        client.save()
                        .then(result =>{
                            
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created',
                                client: client,
                                token: token
                                
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                            res.status(500).json({
                                error: err
                            })
                        })
                    })
                }
            })
        }
    })
}