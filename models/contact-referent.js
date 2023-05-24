const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContactReferent = new Schema({

    nom: {
        type: String,
    },

    prenom: {
        type: String,
    },

    phone: {
        type: String,
    },


  

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('contact', ContactReferent);