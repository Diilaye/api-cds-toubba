const messageModel  = require('../models/messages');

const message  =  require('../utils/message');

const populateObject = [];

const objectPopulate = [
    {
        path : 'files',
    },
    {
        path :'send'
    },
    {
        path :'recive'
    }, 
];
exports.store  = async (req,res,next) => {

    try {
        let {
            objectEmail,
            messageF,
            recive,
            files
        } = req.body;

        const messageS  = contactModel();

        contact.objectEmail = objectEmail;

        contact.message = messageF;

        contact.send = req.user.id_user;

        contact.recive = recive;

        contact.files = files;

        const messageSave = await messageS.save();

        const mesF = await messageModel.findById(messageSave.id).populate(objectPopulate).exec();

        return message.response(res,message.createObject('e-mail'),201,messageSave);

    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }

}

exports.all = async  (req, res ,next) => {

    try {
        
        const messageF = await messageModel.find(req.query).populate(objectPopulate).exec();

       return message.response(res,message.findObject('e-mail'),200,messageF);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

}

exports.one  = async (req,res,next)=>{
    try {
        let {id} =req.params;
        const messageF = await messageModel.findById(id).populate(objectPopulate).exec();

       return message.response(res,message.findObject('e-mail'),200,messageF);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

exports.update = async  (req,res,next)=> {
    
    try {
        let {
            objectEmail,
            messageF,
            recive,
            files
        } = req.body;
    
        const messageD  = await messageModel.findById(req.params.id);
    
    
        if (objectEmail != undefined) {
            messageD.objectEmail = objectEmail;  
        }
    
        
        if (messageF != undefined) {
            messageD.messageF = messageF;  
        }
    
        if (recive != undefined) {
            messageD.recive = recive;  
        }

        if (files != undefined) {
            messageD.files = files;  
        }
        
    
        const messageDSave = await messageD.save();

        const messageDSaveF = await messageModel.findById(messageDSave.id).populate(objectPopulate).exec();
    
        return message.response(res,message.updateObject('e-mail'),200,messageDSaveF);
    
    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }
}

exports.delete = async (req,res ,next) =>  {
    try {
        let {id} =req.params;
        const contactFind = await messageModel.findById(id).exec();
        const rows  = contactFind.delete();

       return message.response(res,message.deleteObject('E-mail'),200,rows);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

