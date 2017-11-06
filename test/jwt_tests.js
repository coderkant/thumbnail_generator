const expect  = require("chai").expect;
const request = require("request");
const logger = require('../app/loggingAndMonitoring/logging')
const PORT_NUM = (process.env.PORT_NUM != undefined)? process.env.PORT_NUM:8000;
const baseURL = "http://127.0.0.1:"+PORT_NUM;
let endPoint="/login"

describe("Login with JWT Tester", function() {
        let token;
        it("supplies Tokens",function(done){
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    },
                json:{
                    "username":"any",
                    "password":"any"
                }
                };
            request.post(options, function(error, response, body) {
                logger.info(body);
                expect(response.statusCode).to.equal(200);
                expect(body.token).to.not.null
                expect(body.token).to.not.be.undefined
                expect(body.token).to.not.be.empty
                token = body.token
                done();
              });    
        });

        it("rejects empty requests",function(done){
            let expected = { "error": "Must have a username and password fields in request body"};
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json'
                }
              };
            request.post(options, function(error, response, body) {
                expect(response.statusCode).to.equal(403);
                expect(body).to.deep.equal(JSON.stringify(expected));
                done();
              });    
        });
    });