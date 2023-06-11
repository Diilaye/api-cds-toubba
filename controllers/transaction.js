const authModel = require("../models/auth");
const transactionModel = require("../models/transaction");

const orderid = require('order-id')('diikaanedevZakat');

const message = require('../utils/message');
const  paypal = require('paypal-rest-sdk');
const populateObject = [{
    path:'project',
},{
    path :'user'
}];


exports.success = async (req, res ,next )=> {
    res.send(req.params);
}

exports.failled  = async (req, res ,next )=> {
    res.send(req.params);
    
}

exports.store = async  (req,res,next) => {
    

    try {


        const auth = authModel.findById(req.user.id_user).populate( {
            path :'partenaires' ,
            populate : [{
                path :'profile',
            },{
                path :'justificatif',
            },]
        }).exec();

        const amount = auth.typeAbonnement == '1' ? 45 : auth.typeAbonnement == '2' ?60 :  auth.typeAbonnement == '3' ? 80: 70;


        for (const iterator of auth.partenaires) {
            if (element['type'] == "enfants") {
                amount =+10;
            }
        }

        

        const transaction = transactionModel();

        const ref = orderid.generate();
            
            
        transaction.reference =  ref;

        transaction.user  = req.user.id_user;

        transaction.amount  = amount;

    
        transaction.type  = type;
    
        const  transactionSave = await transaction.save();
    
            
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': 'AZ2ByBXx4_Ar3IC0aINI_KOnHyVRqXBFkM9-V9ybrUdq59nBfkkXnhgEojNTmM1TkhMPnFMrOA4AbVgo',
            'client_secret': 'EPL6otE_AD5wpAY_o2O2G6T2YEbXHQBJ5n8rmGDFMPEbimbFJeg7z2ogVSI5A6PN-6hfMcWnluIR2NUK'
          });
    
          var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://api.cds-toubaouest.fr/v1/api/transactions/success?idTranssaction="+ref,
                "cancel_url": "https://api.cds-toubaouest.fr/v1/api/transactions/failled?idTranssaction="+ref
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Abonnement annuelle",
                        "sku": "item-annee",
                        "price": amount,
                        "currency": "EUR",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "EUR",
                    "total": amount
                },
                "description": "Description des avantages de cette abonnements."
            }]
        };
        
        paypal.payment.create(create_payment_json, function (error, payment)  {
            if (error) {
                throw error;
            } else {
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
