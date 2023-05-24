const authModel = require('../models/auth');

const projectModdel = require('../models/project');

const orderid = require('order-id')('diikaanedevZakat');

const message  =  require('../utils/message');

var ObjectID = require('mongodb').ObjectID

const populateObject = [{
    path :'cover'
},{
    path:'user'
}];


exports.store = async (req, res, next) => {

   

    try {

        const user = await authModel.findById(req.user.id_user).exec();


        let {
            amount,
            description,
            name,
            cover,
            type,    
        } = req.body;
    
        const project = projectModdel();
    
        const id = orderid.generate();
    
    
        project.reference  =  'PJ-'+orderid.getTime(id);
    
        project.name = name ;
        project.amount = amount ;
    
        project.description = description ;
    
        project.cover = cover ;
    
        project.user = user.id ;
    
        project.type = type ;
    
        const projectSave = await project.save();
    
        const projectFind  = await projectModdel.findById(projectSave._id).populate(populateObject).exec();
    
        
       return message.response(res,message.createObject('Project'),201,projectFind);

    } catch (error) {
       return message.response(res, message.error(),404,error);
    }

}


exports.all = async (req, res, next) => {

    try {
        
        const projectFind = await projectModdel.find(req.query).populate(populateObject).exec();

       return message.response(res,message.findObject('Project'),200,projectFind);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
   

}

exports.allByType = async (req, res, next) => {
    
    let { type } = req.params;

    try {
        
        const projectFind = await projectModdel.find({
            type
        }).populate(populateObject).exec();

       return message.response(res,message.findObject('Project'),200,projectFind);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

   

}


exports.projectByUser = async (req, res, next) => {
    try {
        
        const projectFind = await projectModdel.find({
            user : req.user.id_user
        }).populate(populateObject).exec();

       return message.response(res,message.findObject('Project'),200,projectFind);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

}

exports.projectByStatus = async (req, res, next) => {



    try {

    let { status } = req.params;

        
        const projectFind = await projectModdel.find({
            status : status
        }).populate(populateObject).exec();

       return message.response(res,message.findObject('Project'),200,projectFind);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }

   
}

exports.one = async (req, res, next) => {
    let { id } = req.params;

    try {
        
        const projectFind = await projectModdel.findById(id).populate(populateObject).exec();

       return message.response(res,message.findObject('Project'),200,projectFind);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

exports.update = async (req, res, next) => {




    try {
        
        let {id} = req.params;

        let {
            amount,
            name,
            description,
            type,    
            cover,
            moddelEconomique,
            moddelJuridique,
            contact,
            tansactions,
            views,
            like,
            comments,
            status
        } = req.body;

        const project = await  projectModdel.findById(id).exec();
        
        if (project.user.toString() == ObjectID(req.user.id_user).toString() ) {

            if (amount != undefined) {
                project.amount = amount ;
            }

            if (name != undefined) {
                project.name = name ;
            }

            if (description != undefined) {
                project.description = description ;
            }

            if (cover != undefined) {
                project.cover = cover ;
            }

            if (type != undefined) {
                project.type = type ;
            }

            if (moddelEconomique != undefined) {
                project.moddelEconomique.push(moddelEconomique)   ;
            }

            if (moddelJuridique != undefined) {
                project.moddelJuridique.push(moddelJuridique)   ;
            }

            if (contact != undefined) {
                project.contact.push(contact)   ;
            }

            if (tansactions != undefined) {
                project.tansactions.push(tansactions)   ;
            }

            if (views != undefined) {
                project.views.push(views)   ;
            }

            if (like != undefined) {
                project.like.push(like)   ;
            }


            if (comments != undefined) {
                project.comments.push(comments)   ;
            }


            if (status != undefined) {
                project.status = status ;
            }

            const projectSave = await project.save();

            const projectFind  = await projectModdel.findById(projectSave._id).populate(populateObject).exec();

            
            return message.response(res,message.updateObject('Project'),200,projectFind);
                
            }else {
                return message.response(res, message.error(),404,"Vous n'avez pas acces à ce project");
            }


    } catch (error) {
       return message.response(res, message.error(),404,error);
    }

   
}

exports.delete = async (req, res, next) => {
    let { id } = req.params;

    try {
        
        const projectFind = await projectModdel.findById(id).populate(populateObject).exec();

        const rows =  await projectFind.delete();

       return message.response(res,message.deleteObject('Project'),200,rows);

        
    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}