var io = require('socket.io-client');
var serverUrl = 'http://localhost:8080';

var responseTimeAverage = 0;
var messageCount = 500;
var resultCount = 0;
var experimentStartTime = new Date().getTime();
var requestCount = 10;

var handlePartialResult = function(startTime) {
    var endTime = new Date().getTime();
    var time = endTime - startTime;
    responseTimeAverage = addToAverage(responseTimeAverage, resultCount, time);
    if ((resultCount / requestCount) == messageCount) {
        var experimentEndTime = new Date().getTime();
        //multiply by 100 to get seconds (tps)
        var throughput = resultCount * 1000 / (experimentEndTime - experimentStartTime);
        console.log('average response time: %s', responseTimeAverage);
        console.log('throughput: %s', throughput);
    }
    //console.log('server sent resp code: %s, data: %s, time: %d', resp, JSON.stringify(data), endTime - startTime);
}

for (var i = 0; i < messageCount; i++) {
    var conn = io.connect(serverUrl, {
        forceNew: true
    });
    var startTime = new Date().getTime();
    conn.on('partial-result', function(data) {
        resultCount++;
        handlePartialResult(startTime);
        //        console.log('got following data: ' + data);
    });
    conn.emit('message', {
        request: i,
        requestCount: requestCount
    });
}


function addToAverage(average, size, newValue) {
    return (size * average + newValue) / (size + 1);
}
