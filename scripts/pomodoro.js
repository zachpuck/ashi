'use strict';

module.exports = function(robot) {
    robot.hear(/pomodoro/, function(res) {
        res.send('time to start working!');
    });
}