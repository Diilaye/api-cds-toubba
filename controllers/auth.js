
const authModel = require('../models/auth');

const bcrytjs = require('bcryptjs');

const salt = bcrytjs.genSaltSync(10);

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const veriffMAil = require('deep-email-validator');

const message  =  require('../utils/message');
const codeEmail = require('../models/code-email');

const kickbox = require('kickbox').client(process.env.KEYKICKBOX).kickbox();

const axios = require('axios');


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
    {
        path :'partenaires' ,
        populate : [{
            path :'profile',
        },{
            path :'justificatif',
        },]
    }
];

exports.verifffMail = async(req,res,next) =>{
    let {email} = req.body;

    // kickbox.verify(email, function (err, response) {
    //     // Let's see some results
    //     console.log(response.body);
    //     return message.response(res , message.error() , 200 , response.body);

    //   });


    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=1254286572544ca1a34ff96dd6dca0be&email=${email}`);
       

        if(response.data['deliverability']=='DELIVERABLE') {
            return message.response(res , message.createObject('Email') , 200 , response.data);
        }else {
            return  message.response(res , message.error() ,404 , "email n'existe pas");
        }



}

exports.forgetPassword =  async (req,res ,next) => {

    let {email} = req.body;
    
    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=1254286572544ca1a34ff96dd6dca0be&email=${email}`);
       

    if(response.data['deliverability']=='DELIVERABLE') {
        const user = await authModel.findOne({
            email : email,
        }).exec();
        
        if (user) {
            const min = 1000000;
    
            const max = 9999990;
        
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
        
        
            // Configurer le transporteur SMTP
            const transporter = nodemailer.createTransport({
            service: 'SMTP',
            host: 'smtp.ionos.fr', // 'ssl0.ovh.net',
            port: 465,
            secure: true, // Utilisez true si vous utilisez SSL/TLS
            auth: {
                user: 'admin@cds-toubaouest.fr',
                pass: 'Pf@19581982'
            }
            });
            
                codeT =  codeEmail();
                codeT.code = num.toString();
                codeT.email = email ;
            
                codeF =await codeT.save();
            
            // Définir les informations de l'e-mail
            const mailOptions = {
            from: 'admin@cds-toubaouest.fr',
            to: email,
            subject:  'Code de vérification mailling cds-touba',
            html: `votre code de verification est le : <strong>${num}</strong> .`
            };
            
            // Envoyer l'e-mail
            transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
                return  message.response(res , message.error() ,404 , error);
            
            } else {
                console.log('E-mail envoyé avec succès:', info.response);
                return message.response(res, message.createObject('Code') ,  200 ,{ "code"  : 'envovez' } );
            
            }
            });
        }else {
            return  message.response(res , message.error() ,404 , "email n'existe pas");
        }

     
    } else {
        return  message.response(res , message.error() ,404 , "email n'existe pas");
    }


   

   
    
}

exports.verifCodeVerif = async (req,res) => {
   
    try {
        console.log(req.body);
        const codeF = await codeEmail.findOne({
            code : req.body.code,
            is_treat : false
        });
    
        console.log(codeF);
    
        if(codeF) {
    
            codeF.is_treat = true;
    
            await codeF.save();
    
            const user = await authModel.findOne({
                email : codeF.email,
            }).exec();
    
            const passwordCrypt = bcrytjs.hashSync(req.body.password, salt);
    
            user.password = passwordCrypt ;
    
            const userF = await user.save();
    
            return message.response(res, message.updateObject('User') ,  200 ,{ data  : 'Mot de passe changer' } );
        }
    } catch (error) {
       return  message.response(res , message.error() ,404 , error);
        
    }



}

exports.store = async (req , res , next) => {
    
    
   

    
    

    

    


    try {

        const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=1254286572544ca1a34ff96dd6dca0be&email=${req.body.email}`);

        if(response.data['deliverability']=='DELIVERABLE') {
            const UserEmailF = await authModel.findOne({
                email : req.body.email
            }).exec();
        
            if (UserEmailF) {
                return message.response(res , message.error() , 400 , 'Email déjàs utilisées ');
            }
        
            const UserEmailS = await authModel.findOne({
                numeroSecuriteSocial : req.body.numeroSecuriteSocial
            }).exec();
        
            if (UserEmailS) {
                return message.response(res , message.error() , 402 , 'Numéro sécurité social déjàs utilisées ');
            }
        
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
                pays,
                rue,
                numero_rue,
                code_postal,
                ville,
                numeroSecuriteSocial,
                sexe,
                cni,
                facture,
                contactReferent,
                dateNaiss
            } = req.body;
            
            const auth = authModel() ;
        
            const passwordCrypt = bcrytjs.hashSync(password, salt);
        
            auth.typeAbonnement = typeAbonnement;
            auth.dateNaiss = dateNaiss;
            auth.username = username;
            auth.email = email;
            auth.password = passwordCrypt;
            auth.role = role;
            auth.profile = profile;
            auth.nom = nom;
            auth.prenom = prenom;
            auth.telephone = telephone;
            auth.pays = pays;
            auth.rue = rue;
            auth.numero_rue = numero_rue;
            auth.code_postal = code_postal;
            auth.ville = ville;
            auth.numeroSecuriteSocial = numeroSecuriteSocial;
            auth.sexe = sexe;
            auth.cni = cni;
            auth.facture = facture;
            auth.contactReferent = contactReferent;
        
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
        }else {
            return message.response(res , message.error() , 403 , 'Email pas bon ');
    
        }
        

    
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

    console.log(req.body);
    
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
           return message.response(res , message.error() ,404 , "Identifiant  Incorrect");
        }
        
        
    }
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

            // Configurer le transporteur SMTP
            const transporter = nodemailer.createTransport({
                service: 'SMTP',
                host: 'smtp.ionos.fr', // 'ssl0.ovh.net',
                port: 465,
                secure: true, // Utilisez true si vous utilisez SSL/TLS
                auth: {
                    user: 'admin@cds-toubaouest.fr',
                    pass: 'Pf@19581982'
                }
                });
                
                    
                
                // Définir les informations de l'e-mail
                const mailOptions = {
                from: 'admin@cds-toubaouest.fr',
                to: email,
                subject:  'Code de vérification mailling cds-touba',
                html: `votre compte viens d'être <strong>${req.body.active}</strong>  allez vous conecter sur le lien <strong> <a href ="https://cds-toubaouest.fr/#/">ci-aprés</a></strong> .`
                };
                
                // Envoyer l'e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Erreur lors de l\'envoi de l\'e-mail:', error);
                
                } else {
                    console.log('E-mail envoyé avec succès:', info.response);
                
                }
                });
    
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
    
        if (req.body.pays !=undefined) {
            
            auth.pays = req.body.pays;
    
        }
    
        if (req.body.ville !=undefined) {
    
            auth.ville = req.body.ville;
    
        }
    
        if (req.body.rue !=undefined) {
    
            auth.rue = req.body.rue;
    
        }

        if (req.body.numero_rue !=undefined) {
    
            auth.numero_rue = req.body.numero_rue;
    
        }

        if (req.body.code_postal !=undefined) {
    
            auth.code_postal = req.body.code_postal;
    
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
