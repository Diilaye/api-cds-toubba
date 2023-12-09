const mime = require('mime');
const uid = require('uid');
const path = require('path');
const fs = require('fs');


exports.base64 =  async (base) => {

    if (base === undefined) {
        return false;
    } else {
        // to declare some path to store your converted image
        const matches = base.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};


        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];

        response.data = Buffer(matches[2], 'base64');

        let decodedImg = response;
        

        let imageBuffer = decodedImg.data;

        let type = decodedImg.type;




        let fileName = uid.uid();


        fs.writeFileSync(path.join(__dirname,'..','uploads',fileName+'.'+type.split('/')[1]), imageBuffer, 'utf8');
       
        const stats = fs.statSync(path.join(__dirname,'..','uploads',fileName+'.'+type.split('/')[1]));
        const fileSizeInBytes = stats.size / (1024 * 1024);
      
       if (fileSizeInBytes > 5) {
        
            fs.unlinkSync(path.join(__dirname,'..','uploads',fileName+'.'+type.split('/')[1]));
            return 'File to large';
       
        }else {
            return {
                'url' : `https://api.cds-toubaouest.fr/cds-touba-file/${fileName}.${type.split('/')[1]}`,
                'type' :type
            };
        }

    }

}
