const express = require('express');

// import all controllers

const authCtrl = require('../controllers/auth');

const authMidleweare = require('../midleweares/auth');

const routes = express.Router();

// Add routes
routes.get('/', authMidleweare ,authCtrl.findAuth);
routes.get('/all', authMidleweare ,authCtrl.all);
routes.post('/', authCtrl.store);
routes.post('/auth', authCtrl.auth);
routes.post('/forgetPassword',authCtrl.forgetPassword);
routes.post('/verif-code',authCtrl.verifCodeVerif);
routes.put('/:id', authMidleweare , authCtrl.update);
routes.delete('/:id', authMidleweare ,authCtrl.delete);

module.exports = routes;
