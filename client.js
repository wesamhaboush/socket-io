var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080';

var createHandleResponseDone = function(startTime) {
    return function(resp, data) {
        var endTime = new Date().getTime();
        console.log('server sent resp code: %s, data: %s, time: %d', resp, JSON.stringify(data), endTime - startTime);
    }
}

var messageCount = 5;

for (var i = 0; i < messageCount; i++) {
    var conn = io.connect(serverUrl);
    conn.on('partial-result', function(data) {
        console.log('got following data: ' + data);
    });
    console.log('sending request: ' + i);
    var startTime = new Date().getTime();
    conn.emit('message', {
        request: i
    }, createHandleResponseDone(startTime));
}
