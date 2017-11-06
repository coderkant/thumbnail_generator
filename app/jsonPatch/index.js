const jsonpatch = require('jsonpatch')
const logger = require('../loggingAndMonitoring/logging')

const applyPatch = (req,res) => {
    logger.info("inside applyPatch "+req.url);    
    logger.info(req.body.theObject);
    logger.info(req.body.thePatch);
    try{
        patcheddoc = jsonpatch.apply_patch(req.body.theObject, req.body.thePatch); 
        res.status(200).json(patcheddoc).end();            
    }
    catch(err){
        logger.error(err);
        res.status(400).json({'error':err}).end();            
    }
}

const validateBody =(req,res,next)=> {
    logger.info("inside validateBody "+req.url);
    logger.silly(req.body.hasOwnProperty('theObject'));
    logger.silly(req.body.hasOwnProperty('thePatch'));    
    if(req.body.hasOwnProperty('theObject') && req.body.hasOwnProperty('thePatch')){
        logger.info(req.body.theObject);
        logger.info(req.body.thePatch);
        next();
    }
    else{
        logger.info('recieved invalid patching request '+req.url)
        res.status(400).json({'error':'Body must contain theObject and thePatch fields'}).end();
    }
}

module.exports.validateBody = validateBody;
module.exports.applyPatch = applyPatch;