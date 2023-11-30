const express = require('express');

// import all controllers

const authCtrl = require('../controllers/auth');

const {checkRoleClient, checkRole} = require('../midleweares/auth');

const routes = express.Router();

// Add routes
routes.get('/auth', checkRoleClient() ,authCtrl.findAuth);
routes.get('/all' ,checkRole('admin'),authCtrl.all);
routes.get('/one/:id' ,authCtrl.one);
routes.post('/', authCtrl.store);
routes.post('/auth', authCtrl.auth);
routes.post('/forgetPassword',authCtrl.forgetPassword);
routes.post('/verifMail',authCtrl.verifMail);
routes.post('/verifNumeroSocial',authCtrl.checkNumerSocial);
routes.post('/verif-code',authCtrl.verifCodeVerif);
routes.put('/:id', checkRoleClient() , authCtrl.update);
routes.delete('/:id', checkRoleClient() ,authCtrl.delete);

module.exports = routes;
