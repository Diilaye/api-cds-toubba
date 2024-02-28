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
        path :'recive',
        populate : [{
        path : 'contactReferent',
    },
    {
        path :'profile'
    },
    {
        path :'facture'
    }, {
        path :'cni'
    },
    {
        path :'partenaires' ,
        populate : [{
            path :'profile',
        },{
            path :'justificatif',
        },]
    }]
    }, 
    {
        path : 'send' ,
        populate : [{
        path : 'contactReferent',
    },
    {
        path :'profile'
    },
    {
        path :'facture'
    }, {
        path :'cni'
    },
    {
        path :'partenaires' ,
        populate : [{
            path :'profile',
        },{
            path :'justificatif',
        },]
    }]
    }
];
exports.store  = async (req,res,next) => {


    try {
    let {
        objectEmail,
        messageF,
        recive,
        files
    } = req.body;

    const messageS  = messageModel();

    messageS.objectEmail = objectEmail;

    messageS.message = messageF;

    messageS.send = req.user.id_user;

    messageS.recive = recive;

    messageS.files = files;

    const messageSave = await messageS.save();

    const mesF = await messageModel.findById(messageSave.id).populate(objectPopulate).exec();

    return message.response(res,message.createObject('e-mail'),201,mesF);

    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }

}

exports.all = async  (req, res ,next) => {

 
    try {
        
        const messageF = await messageModel.find({
        }).populate(objectPopulate).exec();

       return message.response(res,message.findObject('e-mail'),200,messageF);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

}

exports.replayMessage  = async (req,res,next) => {


    try {
    let {
        objectEmail,
        messageF,
    } = req.body;

    const messageS  = messageModel();

    messageS.objectEmail = objectEmail;

    messageS.message = messageF;

    messageS.send = req.user.id_user;

    messageS.status = "replay";

    const messageSave = await messageS.save();

    const mesF = await messageModel.findById(messageSave.id).populate(objectPopulate).exec();

    return message.response(res,message.createObject('e-mail'),201,mesF);

    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }

}

exports.allPartenaire = async  (req, res ,next) => {

    try {
        
        const messageF = await messageModel.find({
            recive : req.user.id_user
        }).populate(objectPopulate).exec();

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
            files,
            status
        } = req.body;
    
        const messageD  = await messageModel.findById(req.params.id);
    
    
        if (status != undefined) {
            messageD.status = status;  
        }

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

