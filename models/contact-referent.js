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

    user : {
        type: Schema.Types.ObjectId,
        ref: "users"
    },


  

    date: {
        type: Date,
        default: Date.now()
    }
} , {
    toJSON: {
        transform: function (doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
      },
},{
    timestamps: true 

});

module.exports = mongoose.model('contact', ContactReferent);