// Description:
//   hubot script to call external start on Nintex Workflow Cloud canary workflows.
//
// Commands:
//   hubot canary - canary workflow help.
//   hubot run <environment> canary - starts specific environments(test, stage, or prod) canary workflow.
//
// Configuration:
//   TEST_ENV_CANARY_URL - sets the canary workflow external start url for test environment
//   STAGE_ENV_CANARY_URL - sets the canary workflow external start url for stage environment
//   PROD_ENV_CANARY_URL - sets the canary workflow external start url for prod environment
//
// Notes:
//   see datadog dashboard for results. 
'use strict';

const canaryUrls = {
    "test": process.env.TEST_ENV_CANARY_URL,
    "stage": process.env.STAGE_ENV_CANARY_URL,
    "prod": process.env.PRD_ENV_CANARY_URL
}

module.exports = function(robot) {
    robot.respond(/canary/, function(res) {
        res.reply('say \'run <environment> canary\' (environment = test, stage, or prod)')
    })
    robot.hear(/run (.*) canary/, function(res) {
        let environment = res.match[1]
        let url = canaryUrls[environment]
        let data = {}

        robot.http(url)
            .header('Content-Type', 'application/json')
            .post(data)(function(err, response, body) {
            if (err) {
                res.send(`Encountered an error :( ${err}`);
                return;
            }
            // console.log(body);
            res.send(`running ${environment} canary`);
        });        
    });
}