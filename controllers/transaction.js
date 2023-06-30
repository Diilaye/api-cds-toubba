const DateTime = require("node-datetime/src/datetime");
const authModel = require("../models/auth");
const transactionModel = require("../models/transaction");
const path = require('path');
const orderid = require('order-id')('diikaanedevZakat');

const message = require('../utils/message');
const  paypal = require('paypal-rest-sdk');
const populateObject = [{
    path:'project',
},{
    path :'user'
}];


exports.success = async (req, res ,next )=> {

    const transaction = await transactionModel.findOne({
        token : req.query.token
    }).exec();

    transaction.status = "SUCCESS";
    

    transaction.dateTransactionSuccess = new Date().toISOString().split('T')[0];


   const tf = await transaction.save();

    console.log(tf);


    res.send('<script>window.close();</script>');

}

exports.failled  = async (req, res ,next )=> {
    const transaction = await transactionModel.findOne({
        token : req.query.token
    }).exec();

    transaction.status = "CANCELED";
    

    transaction.dateTransactionSuccess = new Date().toISOString().split('T')[0];


   const tf = await transaction.save();

    console.log(tf);


    res.send('<script>window.close();</script>');
    
}

exports.store = async  (req,res,next) => {

    try {


        const auth = await authModel.findById(req.user.id_user).populate( {
            path :'partenaires' ,
            
        }).exec();
    
        let amount = auth.typeAbonnement == '1' ? 45 : auth.typeAbonnement == '2' ?60 :  auth.typeAbonnement == '3' ? 80: 70;
    
        for (const iterator of auth.partenaires) {
            if (iterator['type'] == "enfants") {
                amount =amount + 10;
            }
        }
    
        
    
       
    
          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://api.cds-toubaouest.fr/v1/api/transactions/success",
                "cancel_url": "https://api.cds-toubaouest.fr/v1/api/transactions/failled"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Abonnement annuelle",
                        "sku": "item-annee",
                        "price": "1",
                        "currency": "EUR",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": "1"
                },
                "description": "Description des avantages de cette abonnements."
            }]
        };
        
        paypal.payment.create(create_payment_json, async (error, payment)  => {
            if (error) {
                throw error;
            } else {
                const transaction = transactionModel();
    
                const ref = orderid.generate();
                    
                    
                transaction.reference =  ref;
            
                transaction.user  = req.user.id_user;
            
                transaction.amount  = amount;

                transaction.token  = payment['links'][1]['href'].split('token=')[1];
            
                const  transactionSave = await transaction.save();


                console.log("Create Payment Response");
                console.log(payment);
                return message.response(res,message.createObject('Transaction'),201,{
                    url:payment['links'][1]['href'],
                   });
         
            }
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

exports.allByUser = async (req,res, next) => {
    try {
        
        const transactionFind = await transactionModel.find(
            {
                user : req.user.id_user
            }
        ).exec();

       return message.response(res,message.findObject('Transaction'),200,transactionFind);

    } catch (error) {
        return message.response(res, message.error(),404,error); 
    }
}