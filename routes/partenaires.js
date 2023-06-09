const express = require('express');



// import all controllers
const  fileCtrl =  require('../controllers/partenaires');
const auth = require('../midleweares/auth');




const routes = new express.Router();

// Add routes
routes.get('/', auth,fileCtrl.all);
routes.get('/:id', auth, fileCtrl.one);
routes.post('/',auth,fileCtrl.store);
routes.delete('/:id', auth, fileCtrl.delete);

module.exports = routes;
    