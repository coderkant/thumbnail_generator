const express = require('express');
const {monitor,countRequests} = require('./app/loggingAndMonitoring/index')
const logger = require('./app/loggingAndMonitoring/logging')
const {ensureUserAndPassword , ensureToken, ensureAdmin,supplyToken} = require('./app/jwt/index.js')
const {validateBody,applyPatch} = require('./app/jsonPatch/index.js');
const {validateURL,generateThumbnail} = require('./app/thumbnail/index.js')
const bodyParser = require('body-parser')
const app = express();
const PORT_NUM = (process.env.PORT_NUM != undefined)? process.env.PORT_NUM:8000;

app.use(countRequests);
app.use(bodyParser.json());
app.post('/login',ensureUserAndPassword,supplyToken);
app.post('/apply_json_patch',ensureToken,validateBody,applyPatch);
app.post('/create_thumbnail',ensureToken,validateURL,generateThumbnail);
app.get("/metrics",ensureToken,ensureAdmin,monitor);
logger.info("Server running on port "+PORT_NUM);
app.listen(PORT_NUM);
