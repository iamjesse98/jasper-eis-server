'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _pythonShell = require('python-shell');

var _pythonShell2 = _interopRequireDefault(_pythonShell);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this file contains all the configs.

// global variables
// for real time data streaming
// for rendering documents and handling requests
var PORT = _config2.default.port; // for doing nlp

// all relative imports here
// http connects both express and socket.io
// all module imports here

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);
var io = (0, _socket.listen)(app.server, { pingTimeout: 30000 }); // { pingTimeout: 30000 } => makes compatible with react-native

// all http routes here
app.get('/*', function (req, res) {
    return res.send('hello');
}); // TODO: render the actual frontend

// all socket routes goes here
io.sockets.on('connection', function (socket) {
    console.log('A fucker just joined on', socket.id);
    socket.on('message', function (data) {
        // process the message here... using nlp techniques, then emit the reply to client and also to raspberry pi server
        var options = {
            mode: 'text',
            scriptPath: __dirname + '/../',
            args: [data.msg]
        };
        _pythonShell2.default.run('nlp.py', options, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log(results[0]);
        });
        socket.emit('reply', { message: data.msg });
    });
});

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, function (_) {
    return console.log('Magic happens on ' + app.server.address().port);
});
//# sourceMappingURL=index.js.map