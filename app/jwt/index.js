
const jwt = require('jsonwebtoken');
const logger = require('../loggingAndMonitoring/logging');
const admin_user = (process.env.ADMIN_USER != undefined) ? process.env.ADMIN_USER : 'admin';
const admin_pass = (process.env.ADMIN_PASS != undefined) ? process.env.ADMIN_PASS : 'admin';

const ensureUserAndPassword = (req, res, next) => {
    logger.info("ensureUserAndPassword called "+req.url);    
    if (req.body.hasOwnProperty('username') && (req.body.hasOwnProperty('password'))) {
        var username = req.body.username;
        var password = req.body.password;
        if (username !== '' && password !== '') {
            req.user = { 'username': username, 'scope': ['user'] };
            //admin login?
            if (username == admin_user && password == admin_pass) {
                req.user.scope.push('admin');
            }
            next();
        }
        else {
            res.status(403).json({ 'error': 'Must have a username and password fields in request body' }).end();
            logger.info('recieved invalid login request');
        }
    }
    else {
        res.status(403).json({ 'error': 'Must have a username and password fields in request body' }).end();
        logger.info('recieved invalid login request');
    }
}

    const ensureToken = (req, res, next) => {
        logger.info("ensureToken called "+req.url);
        const reqHeaders = req.get("authorization");
        if (reqHeaders !== undefined) {
            const reqToken = reqHeaders.split(" ")[1];
            req.token = reqToken;    //make it easy to access
            jwt.verify(reqToken, 'my secret key', (err, decoded) => {
                if (err){
                     logger.error('error verifying token for json patching '+req.url);                                         
                     res.status(403).json({'error':'error verifying token'}).end();
                     return;
                }
                else{
                logger.info('decoded token '+decoded);
                next();
                }
            });
           // next(); //let it go ahead
        }
        else {
            logger.error('There must be the token in authorization header for json patching '+req.url);            
            res.status(403).json({'error':'There must be the token in authorization header'}).end();
            return;
        }
    };

    const supplyToken = (req, res, next) => {
        logger.info("inside supplyToken "+req.url);
        const user = req.user;
        //sign token synchronously
        const token = jwt.sign({ user }, 'my secret key');
        logger.info('recieved valid login request');
        res.json({ token: token});
    };

    module.exports = {
        ensureUserAndPassword: ensureUserAndPassword,
        ensureToken: ensureToken,
        supplyToken: supplyToken
    };