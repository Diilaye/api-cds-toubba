const express = require('express');


// import all controllers
const  transactionCtrl =  require('../controllers/transaction');
const auth = require('../midleweares/auth');


const routes = new express.Router();

// Add routes
routes.get('/', auth,transactionCtrl.all);
routes.get('/allByUser', auth,transactionCtrl.allByUser);
routes.get('/success',transactionCtrl.success);
routes.get('/failled',transactionCtrl.failled);
routes.get('/:id', auth, transactionCtrl.one);
routes.post('/',auth,transactionCtrl.store);
routes.delete('/:id',  auth,transactionCtrl.delete);

module.exports = routes;
    