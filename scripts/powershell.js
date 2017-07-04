'use strict';

// Everything in this section is what the bot is listening for
module.exports = (robot) => {
    robot.respond(/powershell/i, (res) => {
        res.reply('what powershell script would you like to execute?');
    });
}