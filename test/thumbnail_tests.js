const expect  = require("chai").expect;
const request = require("request");
var jimp = require("jimp");

// const logger = require('./app/logger')
const PORT_NUM = (process.env.PORT_NUM != undefined)? process.env.PORT_NUM:8000;
const baseURL = "http://127.0.0.1:"+PORT_NUM;
   describe("Thumbnail Generation tests",function(){
        var token;
        let endPoint = "/create_thumbnail";
        it('rejects unauthorised requests',function(){
            
        });

        it('rejects invalid tokens',function(){
            
        });

        it('rejects empty bodied requests',function(){
            let expected = {'error':'Body must contain url field'};
            let options = {
                url: baseURL+endPoint,
                headers: {
                    'content-type' : 'application/json',
                    'Authorization': 'bearer '+token,
                    }
                };
            request.post(options, function(error, response, body) {
                if(error) console.log(error);
                else{
                    expect(response.statusCode).to.equal(400);
                    expect(body).to.deep.equal(expected);
                }
              });    
        });

        it("supports jpeg format",function(done){
            //increase timeout because of bud file size.
            this.timeout(5000);
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
                if(error) console.log(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/jpeg');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    jimp.read('emma1.jpg').then((emma) =>{ 
                        console.log('this is emma '+emma)                        
                        emma.getBuffer(response.headers['content-type'],(err,buffer)=>{
                        if(err){
                            console.log(err);
                            assert.fail(0,1,'Something went wrong in getBuffer');
                        }
                        else{
                            // expect(body).to.deep.equal(buffer);
                            done();                            
                        }
                    })}).catch((err)=>{console.log(err);});
                }
              });    
        });
        it("supports png format",function(done){
            //increase timeout because of bud file size.
            this.timeout(5000);
            image_url = "http://www.pngpix.com/wp-content/uploads/2016/10/PNGPIX-COM-Emma-Watson-PNG-Transparent-Image-1.png";
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
                if(error) console.log(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/png');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    jimp.read('emma.png').then((emma) =>{ 
                        console.log('this is emma '+emma);
                        emma.getBuffer(response.headers['content-type'],(err,buffer)=>{
                        if(err){
                            console.log(err);
                            assert.fail(0,1,'Something went wrong in getBuffer');
                        }
                        else{
                            // expect(body).to.deep.equal(buffer);
                            done();                            
                        }
                    })}).catch((err)=>{console.log(err);});
                }
              });    
        });
        it("supports bmp format",function(done){
            //increase timeout because of bud file size.
            this.timeout(5000);
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
                if(error) console.log(error);
                else{
                    expect(response.statusCode).to.equal(200);
                    expect(response.headers['content-type']).to.equal('image/bmp');
                    expect(response.headers['x-image-height']).to.equal('50');
                    expect(response.headers['x-image-width']).to.equal('50');
                    jimp.read('emma2.bmp').then((emma) =>{ 
                        console.log('this is emma '+emma);                        
                        emma.getBuffer(response.headers['content-type'],(err,buffer)=>{
                        if(err){
                            console.log(err);
                            assert.fail(0,1,'Something went wrong in getBuffer');
                        }
                        else{
                            // expect(body).to.deep.equal(buffer);
                            done();                            
                        }
                    })}).catch((err)=>{console.log(err);});
                }
              });    
        });
    });