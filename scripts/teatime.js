'use strict';

module.exports = function(robot) {
    robot.hear(/tea time/, function(res) {
        res.send('Right-O, Chap! Jolly Good!');
    });
}