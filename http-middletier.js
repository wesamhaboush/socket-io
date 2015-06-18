//Lets require/import the HTTP module
const http = require('http');

//Lets define a port we want to listen to
const LISTENING_PORT = 8080;
const TARGET_PORT = 8081;
const TARGET_HOST = 'localhost';
const REQUEST_COUNT = 10;
const KA_AGENT = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 30000
});
const OPTIONS = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    method: 'GET',
    agent: KA_AGENT
};

var incomingRequestCount = 0;
//We need a function which handles requests and send response
function handleRequest(request, response) {
    var indexOfSlash = request.url.lastIndexOf('/');
    var requestCount = Number(request.url.substring(indexOfSlash + 1));
    console.log(requestCount);
    requestResultsWaitForAllRequests(requestCount, response);
    console.log('incoming request count [%d]', ++incomingRequestCount);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(LISTENING_PORT, function indicateStartedServer() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", LISTENING_PORT);
});

function requestResultsWaitForAllRequests(requestCount, outres) {
    var requestsCompleted = 0;
    var results = '';
    for (var i = 0; i < requestCount; i++) {
        var request = http.request(OPTIONS, function(inres) {
            inres.on('data', function(chunk) {
                results += chunk;
                ++requestsCompleted;
                if (requestsCompleted == requestCount) {
                    outres.end(results);
                }
            });
        }).end();
    }
}
