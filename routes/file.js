const express = require('express');



// import all controllers
const  fileCtrl =  require('../controllers/file');
const {checkRoleClient, checkRole} = require('../midleweares/auth');





const routes = new express.Router();

// Add routes
routes.get('/', checkRole('super'),fileCtrl.all);
routes.get('/:id', checkRole('super'), fileCtrl.one);
routes.post('/',fileCtrl.store);
routes.delete('/:id', checkRoleClient(), fileCtrl.delete);

module.exports = routes;
    