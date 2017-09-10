//  Description:
//    Allow hubot to interact with StatusIO.
// 
//  Commands:
//    hubot statusio help - lists all commands available for StatusIO.
// 
//  Configuration:
//    statusIoStatusPageId - each status page has a unique Id
//    statusIoApiId - API id found in statusIO settings
//    statusIoApiKey - API key found in statusIO settings
// 
//  Notes:
//    not a production ready solution
//  
//  References:
//      http://docs.statusio.apiary.io
//
'use strict';

const request = require('request');

const statusPageId = process.env.statusIoStatusPageId;
const apiId = process.env.statusIoApiId
const apiKey = process.env.statusIoApiKey

module.exports = function(robot) {
    robot.hear(/statusio help/, function(res) {
        res.send(
            'StatusIO commands: \n \
            `statusio component list` - lists all components being monitored \n \
            `statusio status summary` - checks current status \n \
            `statusio incident list` - list all active incidents \n '
        );
    });

    robot.hear(/statusio component list/, function(res) {
        res.send('checking components!');

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

    robot.hear(/statusio status summary/, function(res){
        res.send('checking status!');

        request({
        method: 'GET',
        url: 'https://api.status.io/v2/status/summary/' + statusPageId,
        headers: {
            'Content-Type': 'application/json',
            'x-api-id': apiId,
            'x-api-key': apiKey
        }}, function (error, response, body) {            
            let statusResults = [];
            function returnStatus(body) {
                JSON.parse(body).result.status.forEach((item) => {
                    statusResults.push(item.name + ': ' + item.status);
                    
                });
            }
            returnStatus(body);
            res.send('Current Status: ' + statusResults);
        });
    })

    robot.hear(/statusio incident list/, function(res){
        res.send('Current incidents: \n');

        request({
        method: 'GET',
        url: 'https://api.status.io/v2/incident/list/' + statusPageId,
        headers: {
            'Content-Type': 'application/json',
            'x-api-id': apiId,
            'x-api-key': apiKey
        }}, function (error, response, body) {
                        
            let incidentResults = [];
            function returnStatus(body) {
                JSON.parse(body).result.active_incidents.forEach((item) => {
                    
                    let componentAffected = []                 
                    item.components_affected.forEach((item) => {
                        componentAffected.push(item.name);
                    })
                    incidentResults.push(componentAffected + ': ' + item.name);
                    
                });
            }
            returnStatus(body);
            res.send('```' + incidentResults.join('\n') + '```');
        });
    })
}
