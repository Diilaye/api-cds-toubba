const express = require('express');


// import all controllers
const  transactionCtrl =  require('../controllers/transaction');
const {checkRoleClient, checkRole} = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/', checkRole('super'),transactionCtrl.all);
routes.get('/allByUser', checkRoleClient(),transactionCtrl.allByUser);
routes.get('/success',transactionCtrl.success);
routes.get('/failled',transactionCtrl.failled);
routes.get('/:id', checkRoleClient(), transactionCtrl.one);
routes.post('/',checkRoleClient(),transactionCtrl.store);
routes.post('/actvation',checkRoleClient(),transactionCtrl.storeWithActivation);
routes.delete('/:id',  checkRoleClient(),transactionCtrl.delete);

module.exports = routes;
    