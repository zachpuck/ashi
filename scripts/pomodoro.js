'use strict';

module.exports = function(robot) {
    robot.hear(/pomodoro/, function(res) {
        res.send('time to start working!');
        setTimeout(function() { breakTime() }, ((25 * 60) * 1000));

        function breakTime() {
        res.send('OMG! Time to take a break!');
        setTimeout(function() { res.send('Break time is over! Type \'Pomodoro\' to keep going!'); }, ((5 * 60) * 1000));
    }
    });


}