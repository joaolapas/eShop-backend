const express = require('express');
const cors = require('cors');
const products = require('./products')
const mogoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const register = require('./routes/register');
const login = require('./routes/login');
const stripe = require('./routes/stripe');
const productsRoute = require('./routes/products');
const users = require('./routes/users');
const orders = require('./routes/orders');


require('dotenv').config();
app.use(cors());
app.use(express.json({limit: '50mb'}));

app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/stripe', stripe);
app.use('/api/products', productsRoute);
app.use('/api/users', users);
app.use('/api/orders', orders);
 
app.get('/', (req, res) => {
    res.send('Hello World!');
})
app.get('/products', (req, res) => {
    res.send(products);
})


const port = process.env.PORT || 5001;

const uri = process.env.DB_URI;

app.listen(port, console.log(`Server running on port ${port}`)); 

mogoose.connect(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Connection failed', err.message);
})