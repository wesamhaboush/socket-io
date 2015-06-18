const http = require('http');
var requestCount = 1;
var resultCount = 0;

const OPTIONS = {
    hostname: 'localhost',
    port: 8080,
    method: 'GET',
    path: '/' + requestCount
};

var responseTimeAverage = 0;
var messageCount = 500;
var experimentStartTime = new Date().getTime();

var handlePartialResult = function(startTime) {
    var endTime = new Date().getTime();
    var time = endTime - startTime;
    responseTimeAverage = addToAverage(responseTimeAverage, resultCount, time);
    if (resultCount == messageCount) {
        var experimentEndTime = new Date().getTime();
        var throughput = resultCount * requestCount * 1000 / (experimentEndTime - experimentStartTime);
        console.log('average response time: %s', responseTimeAverage);
        console.log('throughput: %s', throughput);
    }
    //console.log('server sent resp code: %s, data: %s, time: %d', resp, JSON.stringify(data), endTime - startTime);
}

for (var i = 0; i < messageCount; i++) {
    var startTime = new Date().getTime();
    var request = http.request(OPTIONS, function(inres) {
        inres.on('data', function(chunk) {
            resultCount++;
            handlePartialResult(startTime);
        });
    }).end();
}


function addToAverage(average, size, newValue) {
    return (size * average + newValue) / (size + 1);
}
