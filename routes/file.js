const express = require('express');



// import all controllers
const  fileCtrl =  require('../controllers/file');
const auth = require('../models/auth');




const routes = new express.Router();

// Add routes
routes.get('/', auth,fileCtrl.all);
routes.get('/:id', auth, fileCtrl.one);
routes.post('/',fileCtrl.store);
routes.delete('/:id', auth, fileCtrl.delete);

module.exports = routes;
    