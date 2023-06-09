const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Partenaires = new Schema({


    status : {
        type: String,
        enum: ['active', 'inactive' ],
        default: 'active'
    },
    
    type: {
        type : String,
        enum: ['partenaires', 'enfants' ],
        default: 'partenaires'
    },

    ///Info personelle

    profile : {
        type: Schema.Types.ObjectId,
        ref: "media"
    },

    nom  : {
        type : String,
        default :""
    },


    prenom  : {
        type : String,
        default :""
    },

    telephone  : {
        type : String,
        default :""
    },


    pays : {
        type : String,
        enum: ["france", "italie", "angleterre  ", "portugal" ],
        default: 'france'
    },

    ville : {
        type : String,
        default :""
    },

    code_postal : {
        type : String,
        default :""
    },

    rue : {
        type : String,
        default :""
    },

    numero_rue : {
        type : String,
        default :""
    },

    numeroSecuriteSocial  : {
        type : String,
        default :""
    },

    sexe: {
        type : String,
        enum: ['homme', 'femme'],
        default: 'homme'
    },

    ///Info Sur Documents

    justificatif : {
        type: Schema.Types.ObjectId,
        ref: "media"
    },
    
    date: {
        type: Date,
        default: Date.now()
    }
},{
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.passwords;
        delete  ret.token;
        delete ret.__v;
      },
    },
  },{
    timestamps: true 
  });

module.exports = mongoose.model('partenaires', Partenaires) ;