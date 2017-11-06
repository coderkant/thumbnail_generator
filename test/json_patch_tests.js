const expect  = require("chai").expect;
const request = require("request");
const logger = require('../app/loggingAndMonitoring/logging')
const baseURL = "http://localhost:8000"
let token;

   describe("Json Patching test",function(){
    let endPoint = "/apply_json_patch";    
    before(function(done) {
        let endPoint='/login';
        let options = {
             url: baseURL+endPoint,
             headers: {
                 'content-type' : 'application/json',
                 },
             json:{
                 "username":"any1",
                 "password":"any1"
             }
         };
         request.post(options, function(error, response, body) {
             token = body.token
             logger.info('fresh token '+token);
             done();
         });    
       });
        it("does valid patching",function(done){
            let mydoc = {"baz": "qux","foo": "bar"};
            let thepatch = [{ "op": "replace", "path": "/baz", "value": "boo" }]
            let expected = {"baz": "boo", "foo": "bar"}
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    },
                json:{
                    'theObject':mydoc,
                    'thePatch':thepatch
                }
                };
            request.post(options, (error, response, body)=> {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(body).to.deep.equal(expected);
                    done();
                }
              });    
        });
        it('rejects empty bodied requests',function(done){
            let expected = {
                "error": "Body must contain theObject and thePatch fields"
            };
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    }
                };
            request.post(options, function(error, response, body) {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(400);
                    expect(JSON.parse(body)).to.deep.equal(expected);
                    done();
                }
              });    
        });
        it('rejects bad patch objects',function(done){
            let mydoc = {"baz": "qux","foo": "bar"};
            let thepatch = [{ "op": "remove", "path": "/loo" }]
            let expected = {
                "error": {
                    "message": "Remove operation must point to an existing value!",
                    "level": "error"
                }
            };
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    },
                json:{
                    'theObject':mydoc,
                    'thePatch':thepatch
                }
                };
            request.post(options, function(error, response, body) {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(400);
                    expect(body).to.deep.equal(expected);
                    done();
                }
              });    
        });
    });