const express = require('express');


// import all controllers
const  contactCtrl =  require('../controllers/contact');
const auth = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/', auth,contactCtrl.all);
routes.get('/:id', auth,contactCtrl.one);
routes.put('/:id', auth,contactCtrl.update);
routes.post('/',contactCtrl.store);
routes.delete('/:id', auth,contactCtrl.delete);

module.exports = routes;
    