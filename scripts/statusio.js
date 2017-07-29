'use strict';

module.exports = function(robot) {
    robot.hear(/statusio/, function(res) {
        res.send('checking statusio!');

        let statusPageId = process.env.statusIoStatusPageId;
        let apiId = process.env.statusIoApiId
        let apiKey = process.env.statusIoApiKey        
        
        var request = require('request');

        request({
        method: 'GET',
        url: 'https://api.status.io/v2/component/list/' + statusPageId,
        headers: {
            'Content-Type': 'application/json',
            'x-api-id': apiId,
            'x-api-key': apiKey
        }}, function (error, response, body) {
        // console.log('Status:', response.statusCode);
        // console.log('Headers:', JSON.stringify(response.headers));
        // console.log(JSON.parse(body).result.name);
            let monitoredItems = [];
            function getStatus(body) {
                JSON.parse(body).result.forEach((item) => {
                monitoredItems.push(item.name);
                });
            }
            getStatus(body);
            console.log(monitoredItems);
            res.send('currently monitoring: ' + monitoredItems);
        });
    });
}


