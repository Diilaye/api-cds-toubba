const PartenaireModel = require('../models/partenaires');
const authModel = require('../models/auth');


exports.store = async (req, res ,next ) => {

  
    
    
    
    try {

        let {
            type,
profile,
nom,
prenom,
telephone,
pays,
ville,
code_postal,
rue,
numero_rue,
numeroSecuriteSocial,
sexe,
justificatif
        } = req.body;


    const partenaires =  PartenaireModel(); 

    partenaires.type = type ;
    partenaires.profile = profile ;
    partenaires.nom = nom ;
    partenaires.prenom = prenom ;
    partenaires.telephone = telephone ;
    partenaires.pays = pays ;
    partenaires.ville = ville ;
    partenaires.code_postal = code_postal ;
    partenaires.rue = rue ;
    partenaires.numero_rue = numero_rue ;
    partenaires.numeroSecuriteSocial = numeroSecuriteSocial ;
    partenaires.sexe = sexe ;
    partenaires.justificatif = justificatif ;

    const savePartenaires = await  partenaires.save();

    const auth = await authModel.findById(req.user.id_user).exec();

    auth.partenaires.push(savePartenaires.id) ;

    const authS = await  auth.save();

    return res.json({
        message: 'Fichier crée avec succes',
        status: 'OK',
        data: savePartenaires,
        statusCode: 201
    })
    } catch (error) {
        res.json({
            message: 'Erreur creation',
            status: 'OK',
            data: error,
            statusCode: 400
        })
    }
    
}



exports.all = async (req  , res ,next ) => {
    
    try {
        const files = await PartenaireModel.find(req.query).exec(); 
        res.json({
            message: 'Fichiers trouvée avec succes',
            status: 'OK',
            data: files,
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: 'Fichier non trouvée',
            status: 'OK',
            data: err,
            statusCode: 400
        })
    }
}

exports.one = async (req  , res ,next ) => {
    try {
        const file = await PartenaireModel.findById(req.params.id).exec(); 
        res.json({
            message: 'Fichier trouvée avec succes',
            status: 'OK',
            data: file,
            statusCode: 200
        })
    } catch (error) {
        res.json({
            message: 'Fichier non trouvée',
            status: 'OK',
            data: err,
            statusCode: 400
        })
    }
}

exports.update = async  (req  , res ,next ) => {

    const file = await PartenaireModel.findById(req.params.id).exec();

    res.json(file);
}

exports.delete = (req  , res ,next ) => PartenaireModel.findByIdAndDelete(req.params.id).then(result => {
    res.json({
        message: 'supréssion réussi',
        status: 'OK',
        data: null,
        statusCode: 200
    });
}).catch( err => res.json({
    message: 'erreur supréssion ',
    statusCode: 404,
    data: err,
    status: 'NOT OK'
}));