
const authModel = require('../models/auth');

const bcrytjs = require('bcryptjs');

const salt = bcrytjs.genSaltSync(10);

const jwt = require('jsonwebtoken');

var ObjectID = require('mongodb').ObjectID

const axios = require('axios');

const message  =  require('../utils/message');

require('dotenv').config({
    path: './.env'
});

exports.store = async (req , res , next) => {
    
 
    try {

        let {
            typeAbonnement,
            username,
            email,
            password,
            role,
            profile,
            nom,
            prenom,
            telephone,
            city,
            addresse,
            numeroSecuriteSocial,
            sexe,
            cni,
            facture,
            contactReferent,
            dateJoin
        } = req.body;
        
        const auth = authModel() ;
  
        auth.typeAbonnement = typeAbonnement;
        auth.username = username;
        auth.email = email;
        auth.password = password;
        auth.role = role;
        auth.profile = profile;
        auth.nom = nom;
        auth.prenom = prenom;
        auth.telephone = telephone;
        auth.city = city;
        auth.addresse = addresse;
        auth.numeroSecuriteSocial = numeroSecuriteSocial;
        auth.sexe = sexe;
        auth.cni = cni;
        auth.facture = facture;
        auth.contactReferent = contactReferent;
        auth.dateJoin = dateJoin;

const token = jwt.sign({
    id_user: auth._id,
    roles_user : auth.role , 
    email_user : auth.email
}, process.env.JWT_SECRET, { expiresIn: '8784h' });

auth.token = token; 

const authSave = await auth.save();

return message.response(res, message.updateObject('Users') ,  201,{
    user : authSave,
    token ,
} );


    
    } catch (error) {
    
        res.status(404).json({
            message: 'Erreur création',
            statusCode: 404,
            data:  error,
            status: 'NOT OK'
          });
    
    }
}


exports.auth = async  ( req, res ,_ ) => {
    
   try {
    if(req.body.email != undefined) {

        const user = await authModel.findOne({
            email : req.body.email

        }).exec();

        if (user) {
            if (bcrytjs.compareSync(req.body.password, user.password)) {
                const token = jwt.sign({
                    id_user: user.id,
                    role_user : user.role , 
                    phone_user : user.phone
                }, process.env.JWT_SECRET, { expiresIn: '8784h' });
                user.token = token  ;
                await  user.save();
                return res.json({
                    message: 'Connection réussssi',
                    status: 'OK',
                    data: {
                        user : user ,
                        token : token
                    },
                    statusCode: 200
                });
            } else {
                return res.status(401).json({
                    message: 'Identifiant  Incorrect',
                    status: 'NOT OK',
                    data:  "error identifiant",
                    statusCode: 401
                });
            }
        } else {
            message.response(res , message.error() ,404 , "Identifiant  Incorrect");
        }
        
        
    }

   } catch (error) {

    return  message.response(res , message.error() ,404 , error.stack);
   }


}



exports.findAuth = async (req , res, _ ) =>  {

    const user = await authModel.findById(req.user.id_user).exec();

    return message.response(res, message.updateObject('Users') ,  200,{data :user  } );


}

exports.update = async (req, res ,next ) => {

   
    
    try {
        console.log(req.body);

        const auth = await  authModel.findById(req.user.id_user);
            
        if (req.body.phone!=undefined) {
            auth.phone = req.body.phone ;
        }
        if (req.body.password !=undefined) {
            if(auth.password == undefined) {
                const passwordCrypt = bcrytjs.hashSync(req.body.password, salt);
                auth.passwords = auth.passwords.push(passwordCrypt);
                auth.password = passwordCrypt ;
            }else  {
                if (bcrytjs.compareSync(req.body.password, auth.password)) {
                    const passwordCrypt = bcrytjs.hashSync(req.body.newPassword, salt);
                    auth.passwords = auth.passwords.push(passwordCrypt);
                    auth.password = passwordCrypt ;
                }else {
                    return  message.response(res , message.error() ,404 , "les mot  de passe ne concorde pas");
                }
            }
           
    
        }
    
    
        if (req.body.nom !=undefined) {
            
            auth.nom = req.body.nom ;
    
        }
    
        if (req.body.prenom !=undefined) {
            
            auth.prenom = req.body.prenom ;
    
        }
    
        if (req.body.role !=undefined) {
            
            auth.role = req.body.role ;
    
        }
    
        if (req.body.email !=undefined) {
            
            auth.email = req.body.email ;
    
        }
    
        if (req.body.imageCard !=undefined) {
            
            auth.imageCard = req.body.imageCard ;
    
        }
    
        if (req.body.NameofIDCard !=undefined) {
            
            auth.NameofIDCard = req.body.NameofIDCard ;
    
        }

        if (req.body.NumberfIDCard !=undefined) {
            
            auth.NumberfIDCard = req.body.NumberfIDCard;
    
        }

        if (req.body.MaritalStatut !=undefined) {
            
            auth.MaritalStatut = req.body.MaritalStatut;
    
        }

        if (req.body.sexe !=undefined) {
            
            auth.sexe = req.body.sexe;
    
        }

        

        if (req.body.description !=undefined) {
            
            auth.description = req.body.description;
    
        }

        if (req.body.profile !=undefined) {
            
            auth.profile = req.body.profile;
    
        }

        if (req.body.avatar !=undefined) {

            auth.avatar = req.body.avatar;
    
        }

        if (req.body.contry !=undefined) {

            auth.contry = req.body.contry;
    
        }

        if (req.body.city !=undefined) {

            auth.city = req.body.city;
    
        }

        if (req.body.projects !=undefined) {

            auth.projects.push(req.body.projects) ;
    
        }

        if (req.body.zakat !=undefined) {

            auth.zakat.push(req.body.zakat) ;
    
        }

        if (req.body.transactions !=undefined) {

            auth.transactions.push(req.body.transactions) ;
    
        }
        

    
        const userUpdate =await  auth.save();
    
    
        const token = jwt.sign({
            id_user: auth._id,
            role_user : auth.role , 
            phone_user : auth.phone
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });
    
        return message.response(res, message.updateObject('Users')  , 200,{token , phone : auth.phone , role : auth.role , user:userUpdate  });
    

    } catch (error) {
       
       return  message.response(res , message.error() ,404 , error);
    }
}   

exports.delete = (req, res , next ) => authModel.findByIdAndDelete(req.user.id_user).then(result => {
   return  message.response(res , message.createObject('Code') ,201 , num);
}).catch( err =>  message.response(res , message.error() ,404 , err));
