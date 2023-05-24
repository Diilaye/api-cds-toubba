const express = require('express');


// import all controllers
const  contactCtrl =  require('../controllers/contact');


const routes = new express.Router();

// Add routes
routes.get('/', contactCtrl.all);
routes.get('/:id', contactCtrl.one);
routes.put('/:id', contactCtrl.update);
routes.post('/',contactCtrl.store);
routes.delete('/:id', contactCtrl.delete);

module.exports = routes;
    