const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageEmail = new Schema({

    objectEmail: {
        type: String,
    },

    message: {
        type: String,
    },

    status : {

        type : String ,
        enum: ['read', 'replay' ,'no-read' ,'delete'  ],
        default: 'no-read'

    },

    send : {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    recive : {
        type: Schema.Types.ObjectId,
        ref: "users",
        default : null
    },

    files : [{
        type: Schema.Types.ObjectId,
        ref: "media",
        default  :[]
    }],


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

module.exports = mongoose.model('messages', MessageEmail);