### **JWT, Json patch and sharp example in Node**

Hi All. This is a webservice with three endpoints:
* **host**: localhost:8000
##### **endpoints**: 
* **POST** /login : include any username/password to get a JWT. 
* **POST** /apply_json_patch : send a JSON and a patch object and get the patched result back. Include the JWT recieved earlier.
* **POST** /create_thumbail : send a url of  a public photo to get back a 50x50 thumbnail. Include the JWT recieved earlier.
*(use this subject for most aesthetic results; https://www.google.co.in/search?q=emma+watson&tbm=isch)*

### Installation Instructions.
2. Clone this repository and run **npm i**.
3. Configure port by setting PORT and logging levels by setting LOG_LEVEL environment variables. (optional)
4. Run **npm test** to run tests and **npm start** to start the server.
5. Enjoy the beauty that this micro-service is.

###Additional info.
1. Run **js_doc generate command** to generate HTML docs in  directory/out/
2. Run **Docker Commands**