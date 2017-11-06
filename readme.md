### **JWT, Json patch and sharp example in Node**

Hi All. This is a webservice with three endpoints:
* **host**: localhost
* **port**: 8000

### **endpoints**: 
* **POST /login** : include any username/password (in json body) to get a JWT. 
 *Sample request body: {username: any, password : any}*

* **POST /apply_json_patch** : send a JSON and a patch object  and get the patched result back. Include the JWT recieved earlier.
   *Sample request body: {theObject : theObject, thePatch : thePatch}*
* **POST /create_thumbnail** : send a url of  a public photo to get back a 50x50 thumbnail. Include the JWT recieved earlier.
 *Sample request body: {url: publicImageUrl}*
*(use this subject for most aesthetic results; https://www.google.co.in/search?q=emma+watson&tbm=isch)*

* **GET /metrics**: Monitor the application. Use Admin Login. 
*{username:admin , password:admin}*

### Installation Instructions.
1. Clone this repository and run **npm i**.
2. Configure port by setting PORT_NUM and logging levels by setting LOG_LEVEL environment variables. (optional)
3. Provide Admin credentials as ADMIN_USER and ADMIN_PASS env variables. (optional)
4. Run **npm test** to run tests and **npm start** to start the server.