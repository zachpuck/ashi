'use strict';

module.exports = (robot) => {
    robot.hear(/pomodoro/, function(res) {
        res.send('time to start working!');
    });
}