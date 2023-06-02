
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

const objectPopulate = [
    {
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
];

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

        const passwordCrypt = bcrytjs.hashSync(password, salt);
  
        auth.typeAbonnement = typeAbonnement;
        auth.username = username;
        auth.email = email;
        auth.password = passwordCrypt;
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


exports.all= async (req,res ,next) => {
    try {
         const users = await authModel.find({
           role: { $ne: 'super' } 
         }).populate(objectPopulate).exec();
        
         return message.response(res, message.updateObject('Users') ,  200 ,{ users  } );
        
    } catch (error) {
       return  message.response(res , message.error() ,404 , error);
        
    }
}


exports.auth = async  ( req, res ,_ ) => {
    
   try {
    if(req.body.email != undefined) {

        const user = await authModel.findOne({
            email : req.body.email

        }).populate(objectPopulate).exec();

        console.log('user',user);
        

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

    const user = await authModel.findById(req.user.id_user).populate(objectPopulate).exec();

    return message.response(res, message.updateObject('Users') ,  200,{ user  } );


}

exports.update = async (req, res ,next ) => {

    
    try {
        console.log(req.params);

        const auth = await  authModel.findById(req.params.id).populate(objectPopulate);
    
        console.log(auth);
            
        if (req.body.typeAbonnement!=undefined) {
            auth.typeAbonnement = req.body.typeAbonnement ;
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
    
    
        if (req.body.username !=undefined) {
            
            auth.username = req.body.username ;
    
        }
    
        if (req.body.email !=undefined) {
            
            auth.email = req.body.email ;
    
        }
    
        if (req.body.active !=undefined) {
            
            auth.active = req.body.active ;
    
        }
    
        if (req.body.profile !=undefined) {
            
            auth.profile = req.body.profile ;
    
        }
    
       
    
        if (req.body.nom !=undefined) {
            
            auth.nom = req.body.nom;
    
        }
    
        if (req.body.prenom !=undefined) {
            
            auth.prenom = req.body.prenom;
    
        }
    
        
    
        if (req.body.telephone !=undefined) {
            
            auth.telephone = req.body.telephone;
    
        }
    
        if (req.body.city !=undefined) {
            
            auth.city = req.body.city;
    
        }
    
        if (req.body.addresse !=undefined) {
    
            auth.addresse = req.body.addresse;
    
        }
    
        if (req.body.numeroSecuriteSocial !=undefined) {
    
            auth.numeroSecuriteSocial = req.body.numeroSecuriteSocial;
    
        }
    
    
        if (req.body.sexe !=undefined) {
    
            auth.sexe = req.body.sexe;
    
        }
    
        if (req.body.cni !=undefined) {
    
            auth.cni = req.body.cni;
    
        }
    
        if (req.body.facture !=undefined) {
    
            auth.facture = req.body.facture;
    
        }
    
        if (req.body.appreciation !=undefined) {
    
            auth.appreciation = req.body.appreciation;
    
        }
    
        
        
    
    
        const userUpdate =await  auth.save();
    
        const Uf =  await  authModel.findById(userUpdate.id).populate(objectPopulate)
    
    
        const token = jwt.sign({
            id_user: auth._id,
            role_user : auth.role , 
            phone_user : auth.phone
        }, process.env.JWT_SECRET, { expiresIn: '8784h' });
    
        return message.response(res, message.updateObject('Users')  , 200,{token , phone : auth.phone , role : auth.role , user:Uf  });
    
        
    } catch (error) {
       
       return  message.response(res , message.error() ,404 , error);
    }
}   

exports.delete = (req, res , next ) => {

    const {id} = req.params;

    authModel.findByIdAndDelete(id).then(result => {
        return  message.response(res , message.deleteObject('Users') ,200 , "delete success");
     }).catch( err =>  message.response(res , message.error() ,404 , err));
    
}
