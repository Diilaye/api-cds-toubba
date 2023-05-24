const transactionModel = require("../models/transaction");

const orderid = require('order-id')('diikaanedevZakat');

const message = require('../utils/message');

const populateObject = [{
    path:'project',
},{
    path :'user'
}];

exports.store = async  (req,res,next) => {
    

    try {
        
          
    const transaction =  transactionModel();

    let {
        amount,
        project,
        type,
    } = req.body;

    const ref = orderid.generate();


    transaction.reference =  'TR-'+orderid.getTime(ref);

    transaction.amount  = amount;

    if(req.body.type !="ZAKAT"){
        transaction.project  = project;
    }

    console.log(req.user.id_user);

    transaction.user  = req.user.id_user;

    transaction.type  = type;

    const  transactionSave = await transaction.save();

    const transactionFind  = await transactionModel.findById(transactionSave._id).populate(populateObject).exec();

   return message.response(res,message.createObject('Transaction'),201,{
    url:req.url,
    transaction : transactionFind
   });

    } catch (error) {
       return message.response(res, message.error(),404,error);
        
    }

}

exports.all = async (req,res,next) => {

    try {
        
        const transactionFind = await transactionModel.find(req.query).exec();

       return message.response(res,message.findObject('Transaction'),200,transactionFind);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

exports.one  = async (req,res,next)=>{
    try {
        let {id} =req.params;
        const transactionFind = await transactionModel.findById(id).exec();

       return message.response(res,message.findObject('Transaction'),200,transactionFind);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}

exports.update = async  (req,res,next)=> {

    try {
        let {
            amount,
            project,
            type,
            method
        } = req.body;

        const transaction  = transactionModel.findById(req.params.id);

        if (amount != undefined) {
            transaction.amount = amount;  
        }

        if (project != undefined) {
            transaction.project = project;  
        }

        if (type != undefined) {
            transaction.type = type;  
        }

        

        

        const transactionSave = await transaction.save();

        return message.response(res,message.updateObject('Transaction'),200,transactionSave);

    } catch (error) {

       return message.reponse(res , message.error() ,404 , error);
    
    }
}

exports.delete = async (req,res ,next) =>  {
    try {
        let {id} =req.params;
        const contactFind = await transactionModel.findById(id).exec();
        const rows  = contactFind.delete();

       return message.response(res,message.deleteObject('Transaction'),200,rows);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}
