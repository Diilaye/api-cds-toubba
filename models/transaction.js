const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionModel = new Schema({
    
    reference: {
        type: String 
    },

    amount : {
        type : String
    },

    token : {
        type : String
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