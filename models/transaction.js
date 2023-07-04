const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionModel = new Schema({
    
    reference: {
        type: String 
    },

    amount : {
        type : String
    },

    justificatif : {
        type : String
    },


    token : {
        type : String,
        unique : true
    },

    user : {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    
    status: {
        type: String,
        enum: ['PENDING', 'SUCCESS','CANCELED'],
        default: 'PENDING'
    },

    type: {
        type: String,
        enum: ['en ligne', 'virement banquaire','en espseces'],
        default: 'en ligne'
    },

    documents : {
        type: Schema.Types.ObjectId,
        ref: "media"
    },

    dateTransactionSuccess: {
        type: String,
        default : ""
    },
},{
    toJSON: {
        transform: function (doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        },
      },
});

module.exports = mongoose.model('transactions', transactionModel) ;