const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserModel = new Schema({

    typeAbonnement  : {
        type : String,
        enum: ['1', '2' ,'3' ,'4' ,'5' ],
        default: '1'
    },

    username: {
        type: String,
    },
    
    email: {
        type: String,
        required : true,
        unique : true
    },

    active : {
        type: String,
        default :'inactive'
    },


    password: {
        type: String,
    },

    passwords : {
        type : Array
    },
    
    role: {
        type : String,
        enum: ['utilisateur', 'super','particulier' ],
        default: 'utilisateur'
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

    vile : {
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

    cni : {
        type: Schema.Types.ObjectId,
        ref: "media"
    },

    facture : {
        type: Schema.Types.ObjectId,
        ref: "media"
    },
    
///contact referent
    contactReferent : {
        type: Schema.Types.ObjectId,
        ref: "contact"
    },

    ///appreciation admin

    appreciation : {
        type: String,
        default :""
    },
  
    token : {
        type : String,
        default : ""
    },
    
    dateJoin: {
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

module.exports = mongoose.model('users', UserModel) ;