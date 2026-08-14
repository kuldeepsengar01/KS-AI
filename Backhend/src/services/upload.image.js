const Imagekit = require('@imagekit/nodejs');
const {toFile} = require('@imagekit/nodejs');
const {v4 : uuidv4}=require('uuid');

const imagekit = new Imagekit({
    privateKey:process.env.IMAGEKITPRIVETEKEY,
    publicKey:process.env.IMAGEKITPUBLICKEY,
    urlEndpoint: process.env.IMAGEKITURLENDPOINT
});

async function UploadImage(file) {
    const filename = uuidv4() + '-' + file.originalname;

    const imagefile = await toFile(
        file.buffer,
        filename
    )

    const result = await imagekit.files.upload({
        file:imagefile,
        fileName:filename
    })

    return result;
}

module.exports={
    UploadImage
}