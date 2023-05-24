const express = require('express');


// import all controllers
const  transactionCtrl =  require('../controllers/transaction');


const routes = new express.Router();

// Add routes
routes.get('/', transactionCtrl.all);
routes.get('/:id', transactionCtrl.one);
routes.post('/',transactionCtrl.store);
routes.delete('/:id', transactionCtrl.delete);

module.exports = routes;
    