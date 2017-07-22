'use strict';

const StatusIOApi = require('statusio').StatusIOApi;

const api = new StatusIOApi('fe95676e-421f-4e55-94e3-aa7c9b291828', 'xDaJahiIQcnyuTXBBKT9+dTnTF0WW5Qn9sXwg+Tb4tSsbY+hj4Y41Ty/5nqEaLgMr/PukhDwwjWwIqsyeH7q2Q==')
api.setStatusPage('568acbf61ce86b532e000488');


module.exports = function(robot) {
    robot.hear(/statusio/, function(res) {
        res.send(
            api.status.summary(function(error, data){
                if(error) {
                    return data;
                } else {
                    return data;
                }
            })
        )
    })

}