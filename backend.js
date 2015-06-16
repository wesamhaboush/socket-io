//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8081; 
const DESCRIPTION = generateDescriptionWithSize(30000);
var responseCount = 0;

//We need a function which handles requests and send response
function handleRequest(request, response){
    var result = { 
		response : ++responseCount, 
		name : 'somename', 
		age: responseCount + 1,
		favouriteColor: 'red',
                description: DESCRIPTION
	}
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(result));
    
    console.log('served [%d] requests', responseCount);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function indicateStartedServer(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

function generateDescriptionWithSize(size){
	var result = '';
	for(var i = 0; i < size; i++) {
		result += 'a';
	}
	return result;
}
