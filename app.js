const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const db = require('./config/db');

const app = express();

const path = require('path');

const authRoute  = require('./routes/auth');

const fileRoute  = require('./routes/file');

const contactRoute  = require('./routes/contact');

const messageRoute  = require('./routes/messages');

const partenairesRoute  = require('./routes/partenaires');

const transactionRoute  = require('./routes/transaction');

const auth = require('./midleweares/auth');

const  paypal = require('paypal-rest-sdk');

require('dotenv').config({
    path: './.env'
});

app.use(cors());

app.use(bodyParser.json({
    limit: '10000mb'
}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10000mb'
}));
paypal.configure({
    'mode': 'live', //sandbox or live
    'client_id':  process.env.client_id ,
    'client_secret': process.env.client_secret
  });
/**
 * Import Router 
 */

app.get('/' , (req,res) => {
    res.send('ici la terre');
});

app.use('/cds-touba-file', express.static('uploads'));


app.use('/v1/api/users' , authRoute);

app.use('/v1/api/files' ,fileRoute);

app.use('/v1/api/contact'  ,  contactRoute);

app.use('/v1/api/messages'  ,  messageRoute);

app.use('/v1/api/partenaires'  ,  partenairesRoute);

app.use('/v1/api/transactions'  ,  transactionRoute);

db().then(_ => {
    const port = process.env.PORT
    app.listen(port, () => {
        console.log(process.env.MONGO_RUI);
        console.log(`Server started on ${port}`);
    });
});
