var jimp = require("jimp");

module.exports.validateURL = (req,res,next)=>{
    logger.silly(req.body.hasOwnProperty('url'));
    if (req.body.hasOwnProperty('url')) {
        request.head(req.body.url, (error, response, body) => {
            if (error) {
                logger.error(error);
                res.status(400).json({ 'error': 'Error Verifying Url' }).end();
            }
            else {
                logger.info('content-type:', JSON.stringify(response.headers['content-type']));
                logger.info('content-length:', JSON.stringify(response.headers['content-length']));
                // if(["image/jpg","image/jpeg","image/png","image/bmp"].includes(response.headers['content-type'])){
                    if(JSON.stringify(response.headers['content-type']).includes("image")){
                        next();
                    }
                    else{
                        logger.info('recieved url for thumbnail , does not have image MIME type.');
                        res.status(400).json({ 'error': 'Provided url does not have image MIME type' }).end();
                    }
            }
    })}
    else{
        logger.info('recieved invalid request')
        res.status(400).json({ 'error': 'Body must contain url field' }).end();
    }
}

module.exports.generateThumbnail = (req, res) => {
    jimp.read(req.body.url).then(function (emma) {
        // have to resize synchronously because of library limitations
        thumbnail = emma.resize(50, 50);
        thumbnail.getBuffer(thumbnail.getMIME(), (err, buffer) => {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            else {
                res.set('X-Image-Height', thumbnail.bitmap.height);
                res.set('X-Image-Width', thumbnail.bitmap.width);
                res.status(200).set('content-type', thumbnail.getMIME()).send(buffer).end();
            }
        });
    }).catch(function (err) {
        logger.error('line 46');
        logger.error(err);
        res.send(err).end();
    });
}