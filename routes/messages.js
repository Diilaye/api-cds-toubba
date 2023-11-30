const express = require('express');


// import all controllers
const  messageCtrl =  require('../controllers/messages');
const {checkRoleClient, checkRole} = require('../midleweares/auth');




const routes = new express.Router();

// Add routes
routes.get('/', checkRoleClient(),messageCtrl.all);
routes.get('/:id', checkRoleClient(),messageCtrl.one);
routes.put('/:id', checkRoleClient(),messageCtrl.update);
routes.post('/',checkRoleClient(),messageCtrl.store);
routes.delete('/:id', checkRoleClient(),messageCtrl.delete);

module.exports = routes;
    