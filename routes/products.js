const { Product } = require("../models/product");
const express = require('express');
const cloudinary = require('../utilities/cloudinary')
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

//create
router.post('/', isAdmin, async (req, res) => {
    //console.log('atençao: ', req.body);
    const {name, brand, description, price, image} = req.body; 
    try{
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image, {
                upload_preset: 'eShop'
            })
            if(uploadRes){
                const product = new Product({
                    name,
                    brand,
                    description,
                    price, 
                    image: uploadRes.url
                })

                const savedProduct = await product.save()
                res.status(200).send(savedProduct)
            }
        }
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
})

router.get('/', async (req, res) => {
    try{
        const products = await Product.find()
        res.status(200).send(products)
    }catch(err){
        console.log(err)
        res.status(500).send(err) 
    }
})

module.exports = router;