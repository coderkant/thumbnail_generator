const express = require('express');
const {monitor,countRequests} = require('./app/loggingAndMonitoring/index')
const logger = require('./app/loggingAndMonitoring/logging')
const {ensureUserAndPassword , ensureToken, supplyToken} = require('./app/jwt/index.js')
const {validateBody,applyPatch} = require('./app/jsonPatch/index.js');
const {validateURL,generateThumbnail} = require('./app/thumbnail/index.js')
const bodyParser = require('body-parser')
const app = express();
const PORT_NUM = (process.env.PORT_NUM != undefined)? process.env.PORT_NUM:8000;

app.use(countRequests);
app.use(bodyParser.json());
// app.use(bodyParser.json({type: ()=> {return true;}}));    //body of request must be json.
app.get("/metrics",monitor);
app.post('/login',ensureUserAndPassword,supplyToken);
logger.info(typeof(validateBody));
logger.info(typeof(applyPatch));
app.post('/apply_json_patch',ensureToken,validateBody,applyPatch);
// app.post('/generate_thumbnail',ensureToken,validateURL,generateThumbnail);
// app.get("/metrics",[ensureToken,ensureAdmin],monitor);
//console.log(logger);
logger.info("Server running on port "+PORT_NUM);
app.listen(PORT_NUM);
