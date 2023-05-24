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

        let extension = mime.getExtension(type);

        let fileName = uid.uid();


        fs.writeFileSync(path.join(__dirname,'..','uploads',fileName+'.'+extension), imageBuffer, 'utf8');


        console.log(path.join('..','uploads'));
        

        return {
            'url' : `https://api-zakat.verumsoft.com/zakat-file/${fileName}.${extension}`,
            'type' :type
        };

    }

}
