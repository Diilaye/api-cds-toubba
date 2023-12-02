const express = require('express');



// import all controllers
const  fileCtrl =  require('../controllers/partenaires');
const {checkRoleClient, checkRole} = require('../midleweares/auth');





const routes = new express.Router();

// Add routes
routes.get('/', checkRole("super"),fileCtrl.all);
routes.get('/allByUser', checkRoleClient(),fileCtrl.allByUser);
routes.get('/:id', checkRoleClient(), fileCtrl.one);
routes.post('/',checkRoleClient(),fileCtrl.store);
routes.delete('/:id', checkRoleClient(), fileCtrl.delete);

module.exports = routes;
    