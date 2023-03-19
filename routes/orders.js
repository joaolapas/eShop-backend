const { Order } = require("../models/Order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const orders = await Order.find()
        res.status(200).send(orders)
    }catch(err){
        console.log(err)
        res.status(500).send(err) 
    }
})

module.exports = router;
