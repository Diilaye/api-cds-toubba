const express = require('express');


// import all controllers
const  contactCtrl =  require('../controllers/contact');
const {checkRoleClient, checkRole} = require('../midleweares/auth');




const routes = new express.Router();

// Add routes
routes.get('/', checkRoleClient(),contactCtrl.all);
routes.get('/:id', checkRoleClient(),contactCtrl.one);
routes.put('/:id', checkRoleClient(),contactCtrl.update);
routes.post('/',contactCtrl.store);
routes.delete('/:id', checkRoleClient(),contactCtrl.delete);

module.exports = routes;
    