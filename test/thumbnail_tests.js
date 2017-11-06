const expect  = require("chai").expect;
const request = require("request");
const jimp = require("jimp");
const logger = require("../app/loggingAndMonitoring/logging");
const time_out= 5000
// const logger = require('./app/logger')
const PORT_NUM = (process.env.PORT_NUM != undefined)? process.env.PORT_NUM:8000;
const baseURL = "http://127.0.0.1:"+PORT_NUM;
   describe("Thumbnail Generation tests",function(){
        let token;
        let endPoint = "/create_thumbnail";
        before(function(done) {
            let endPoint='/login';
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
                 token = body.token
                 logger.info('fresh token '+token);
                 done();
            });    
        });
        it('rejects unauthorised requests',function(done){
            let expected = {error: "There must be the token in authorization header"};
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    }
                };
            request.post(options, function(error, response, body) {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(403);
                    expect(JSON.parse(body)).to.deep.equal(expected);
                    done();
                }
              });     
        });

        it('rejects invalid tokens',function(done){
            let image_url = "https://pbs.twimg.com/profile_images/832577643396612097/bgWfZsnE.jpg";            
            let expected = {"error": "error verifying token"};
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+'random wrong token',
                    },
                json:{
                    'url':image_url,
                }
                };
            request.post(options, function(error, response, body) {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(403);
                    expect(body).to.deep.equal(expected);
                    done();
                }
              });     
        });

        it('rejects empty bodied requests',function(done){
            let expected = {'error':'Body must contain url field'};
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

        it("supports jpeg format",function(done){
            //increase timeout because of file size.
            this.timeout(time_out);
            image_url = "https://pbs.twimg.com/profile_images/832577643396612097/bgWfZsnE.jpg";
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    },
                json:{
                    'url':image_url,
                }
                };
            request.post(options, (error, response, body)=> {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/jpeg');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    done();
                }
              });    
        });
        it("supports png format",function(done){
            //increase timeout because of bud file size.
            this.timeout(time_out);
            image_url = "https://cdn.inquisitr.com/wp-content/uploads/2010/08/emma-watson-new-haircut.png";
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    },
                json:{
                    'url':image_url,
                }
                };
            request.post(options, (error, response, body)=> {
                if(error) logger.error(error);
                else{ 
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/png');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    done();
                }
              });    
        });
        it("supports bmp format",function(done){
            //increase timeout because of bud file size.
            this.timeout(time_out);
            image_url = "https://pbs.twimg.com/profile_images/226496733/emmawatson.bmp";
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    },
                json:{
                    'url':image_url,
                }
                };
            request.post(options, (error, response, body)=> {
                if(error) logger.error(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/bmp');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    done();
                    // jimp.read('emma2.bmp').then((emma) =>{ 
                    //     console.log('this is emma '+emma);                        
                    //     emma.getBuffer(response.headers['content-type'],(err,buffer)=>{
                    //     if(err){
                    //         console.log(err);
                    //         assert.fail(0,1,'Something went wrong in getBuffer');
                    //     }
                    //     else{
                    //         // expect(body).to.deep.equal(buffer);
                    //         done();                            
                    //     }
                    // })}).catch((err)=>{console.log(err);});
                }
              });    
        });
    });