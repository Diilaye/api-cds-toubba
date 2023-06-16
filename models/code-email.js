const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodeEmailModel = new Schema({

    code: {
        type: String,
    },

    email: {
        type: String,

    },


    is_treat: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('code-email', CodeEmailModel);