const moment = require('moment')

function formatMessage(username, text,port) {
    return {
        username: username,
        text: port +': '+text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;