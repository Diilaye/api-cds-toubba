const express = require('express');


// import all controllers
const  messageCtrl =  require('../controllers/messages');
const auth = require('../midleweares/auth');



const routes = new express.Router();

// Add routes
routes.get('/', auth,messageCtrl.all);
routes.get('/:id', auth,messageCtrl.one);
routes.put('/:id', auth,messageCtrl.update);
routes.post('/',messageCtrl.store);
routes.delete('/:id', auth,messageCtrl.delete);

module.exports = routes;
    