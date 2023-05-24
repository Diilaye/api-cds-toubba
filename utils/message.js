
exports.response  = (res, message , status ,  data)  => res.status(status).json({
    message:message,
    data: data,
    statusCode: status
});

exports.createObject = (object) => object  + ' creer avec succes';

exports.updateObject = (object) => object  + ' modifier avec succes';

exports.findObject = (object) => object  + ' trouver avec succes';

exports.login = (value) => value == "1" ? "Connection réussi" :  'Identifiant   Incorrect';

exports.notFindObject = (object) => object  + ' non trouveé';

exports.deleteObject = (object) => object  + ' supprimer avec succes';

exports.error = () =>  'error trouver avec succes';

