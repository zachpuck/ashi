//  Description:
//    Allow hubot to interact with StatusIO.
// 
//  Commands:
//    hubot statusio - returns list of items being monitored.
// 
//  Configuration:
//    statusIoStatusPageId - each status page has a unique Id
//    statusIoApiId - API id found in statusIO settings
//    statusIoApiKey - API key found in statusIO settings
// 
//  Notes:
//    not a production ready solution
'use strict';

const request = require('request');

const statusPageId = process.env.statusIoStatusPageId;
const apiId = process.env.statusIoApiId
const apiKey = process.env.statusIoApiKey

module.exports = function(robot) {
    robot.hear(/statusio/, function(res) {
        res.send('checking statusio!');

        request({
        method: 'GET',
        url: 'https://api.status.io/v2/component/list/' + statusPageId,
        headers: {
            'Content-Type': 'application/json',
            'x-api-id': apiId,
            'x-api-key': apiKey
        }}, function (error, response, body) {

            let monitoredItems = [];
            function getStatus(body) {
                JSON.parse(body).result.forEach((item) => {
                monitoredItems.push(item.name);
                });
            }
            getStatus(body);
            res.send('currently monitoring: ' + monitoredItems);
        });
    });
}


