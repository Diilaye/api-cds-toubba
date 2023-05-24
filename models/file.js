const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FileModel = new Schema({

    user : {
        type: Schema.Types.ObjectId,
        ref :'users'
    },

    url : {
        type: String,
    },

    type : {
        type: String,
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
          delete ret.__v;
        },
      },
});

module.exports = mongoose.model('media', FileModel) ;