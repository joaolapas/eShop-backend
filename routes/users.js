const { User } = require("../models/user");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");
const express = require("express");

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).send(users)
    }catch(err){
        console.log(err)
        res.status(500).send(err) 
    }
})

module.exports = router;
