'use strict';

module.exports = robot => {
    robot.respond(/powershell/i, res => {
        res.reply("what powershell script would you like to execute?");
    });
}