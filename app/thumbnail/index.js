const jimp = require("jimp");
const logger = require('../loggingAndMonitoring/logging');
const request = require('request');

module.exports.validateURL = (req,res,next)=>{
    logger.silly('validateURL '+req.body.hasOwnProperty('url'));
    if (req.body.hasOwnProperty('url')) {
        request.head(req.body.url, (error, response, body) => {
            if (error) {
                logger.error(error);
                res.status(400).json({ 'error': 'Error Verifying Url' }).end();
            }
            else {
                logger.info({'content-type:': JSON.stringify(response.headers['content-type'])});
                logger.info({'content-length:': JSON.stringify(response.headers['content-length'])});
                    if(JSON.stringify(response.headers['content-type']).includes("image")){
                        next();
                    }
                    else{
                        logger.info('recieved url for thumbnail , does not have image MIME type.');
                        res.status(400).json({ 'error': 'Provided url does not have image MIME type' });
                        next(); //still let the request proceed
                    }
            }
    })}
    else{
        logger.info('recieved invalid request')
        res.status(400).json({ 'error': 'Body must contain url field' }).end();
    }
}

module.exports.generateThumbnail = (req, res) => {
    logger.info('inside generateThumbnail '+req.url);
    jimp.read(req.body.url).then(function (emma) {
        // have to resize synchronously because of library limitations
        thumbnail = emma.resize(50, 50);
        thumbnail.getBuffer(thumbnail.getMIME(), (err, buffer) => {
            if (err) {
                logger.error(err);
                res.send(err);
            }
            else {
                logger.info("buffer created successfully "+req.url);
                res.set('X-Image-Height', thumbnail.bitmap.height);
                res.set('X-Image-Width', thumbnail.bitmap.width);
                res.status(200).set('content-type', thumbnail.getMIME()).send(buffer).end();
                logger.info("thumbnail sent successfully "+req.url);
            }
        });
    }).catch(function (err) {
        logger.error('line 46');
        logger.error(err);
        res.send(err).end();
    });
}