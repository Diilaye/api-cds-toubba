const contactModel  = require('../models/contact-referent');

const message  =  require('../utils/message');


exports.store  = async (req,res,next) => {

    try {
        let {
            nom,
            prenom,
            phone
        } = req.body;

        const contact  = contactModel();

        contact.nom = nom;

        contact.prenom = prenom;

        contact.phone = phone;

        const contactSave = await contact.save();

        return message.response(res,message.createObject('Contact'),201,contactSave);

    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }

}

exports.all = async  (req, res ,next) => {

    try {
        
        const contactFind = await contactModel.find(req.query).exec();

       return message.response(res,message.findObject('Contact'),200,contactFind);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

}

exports.one  = async (req,res,next)=>{
    try {
        let {id} =req.params;
        const contactFind = await contactModel.findById(id).exec();

       return message.response(res,message.findObject('Contact'),200,contactFind);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

exports.update = async  (req,res,next)=> {
    
    try {
        let {
            nom,
            prenom,
            phone
        } = req.body;
    
        const contact  = await contactModel.findById(req.params.id);
    
        console.log(contact);
    
        if (phone != undefined) {
            contact.phone = phone;  
        }
    
        
        if (nom != undefined) {
            contact.nom = nom;  
        }
    
        if (prenom != undefined) {
            contact.prenom = prenom;  
        }
        
    
        const contactSave = await contact.save();
    
        return message.response(res,message.updateObject('Contact'),200,contactSave);
    
    } catch (error) {

       return message.response(res , message.error() ,404 , error);
    
    }
}

exports.delete = async (req,res ,next) =>  {
    try {
        let {id} =req.params;
        const contactFind = await contactModel.findById(id).exec();
        const rows  = contactFind.delete();

       return message.response(res,message.deleteObject('Contact'),200,rows);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

