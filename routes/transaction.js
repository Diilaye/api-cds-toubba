const express = require('express');


// import all controllers
const  transactionCtrl =  require('../controllers/transaction');
const auth = require('../midleweares/auth');


const routes = new express.Router();

// Add routes
routes.get('/', auth,transactionCtrl.all);
routes.get('/:id', auth, transactionCtrl.one);
routes.post('/',transactionCtrl.store);
routes.delete('/:id',  auth,transactionCtrl.delete);

module.exports = routes;
    