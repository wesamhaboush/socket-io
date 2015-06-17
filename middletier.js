//Lets require/import the HTTP module
const http = require('http');
const io = require('socket.io');

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

//Create a server
var server = http.createServer(function() {});
var socket = io.listen(server);

//Lets start our server
server.listen(LISTENING_PORT, function indicateStartedServer() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", LISTENING_PORT);
});

socket.on('connection', function(client) {
    console.log('client connection made');
    // Success!  Now listen to messages to be received
    client.on('message', function(event, clientCallBack) {
        console.log('Received request from client!', event);
        requestResultsOnTheFly(client, clientCallBack);
    });
    client.on('disconnect', function() {
        console.log('Server has disconnected');
    });

});



function requestResultsOnTheFly(socket, clientCallBack) {
    var requestsCompleted = 0;
    for (var i = 0; i < REQUEST_COUNT; i++) {
        http.request(OPTIONS, function(inres) {
            inres.setEncoding('utf8');
            inres.on('data', function(chunk) {
                socket.emit('partial-result', chunk);
                ++requestsCompleted;
                if (requestsCompleted == REQUEST_COUNT) {
                    clientCallBack(0, {
                        completed: requestsCompleted
                    });
                    //socket.disconnect();
                }
            });
        }).end();
    }
}
