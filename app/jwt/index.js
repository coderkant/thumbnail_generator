
const jwt = require('jsonwebtoken');
const logger = require('../loggingAndMonitoring/logging')
const admin_user = (process.env.ADMIN_USER != undefined)? process.env.ADMIN_USER:'admin';
const admin_pass = (process.env.ADMIN_PASS != undefined)? process.env.ADMIN_PASS:'admin';

const ensureUserAndPassword = (req,res,next) =>{
    if(req.body.hasOwnProperty('username') && (req.body.hasOwnProperty('password'))){
        var username = req.body.username;
        var password = req.body.password;
        if(username !== '' && password !== ''){
            req.user ={'username':username,'scope':['user']}
            //admin login?
            if(username==admin_user && password ==admin_pass){
                req.user.scope.push('admin')
            }
            next();
        }
        else res.status(403).json({'error':'Must have a username and password fields in request body'})
    }
    else res.status(403).json({'error':'Must have a username and password fields in request body'}) 
}

const ensureToken = (req,res,next) =>{
    const reqHeaders = req.get("authorization");
    logger.log('Hello log files!', {someKey: 'some-value'})
    if(reqHeaders !== undefined){
        const reqToken = reqHeaders.split(" ")[1];
        req.token = reqToken    //make it easy to access
        jwt.verify(reqToken, 'my secret key', function(err, decoded) {
          if(err)res.sendStatus(403);
          else {
            logger.log({'level':log_level,'message':decoded});
            next();
          }
        });           
        next(); //let it go ahead
    }
    else{
        res.sendStatus(403);
    }
 }

 const suppyTsupplyTokenoken =(req,res,next) =>{
    const user = req.user;
    //sign token synchronously
    const token = jwt.sign({user},'my secret key',{expiresIn:15*60*60});
    res.json({
        token:token
    })};

    module.exports={
        ensureUserAndPassword:ensureUserAndPassword,
        ensureToken:ensureToken,
        supplyToken:supplyToken
    }