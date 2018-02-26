'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _compromise = require('compromise');

var _compromise2 = _interopRequireDefault(_compromise);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this file contains all the configs.

// global variables
// for real time data streaming
// import PythonShell from 'python-shell' // for doing nlp
// for rendering documents and handling requests
var PORT = _config2.default.port; // for nlp

// console.log(nlp(`Turn on the lights.`).normalize().out('text'))

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
        // const options = {
        //     mode: 'text',
        //     scriptPath: __dirname + '/../',
        //     args: [ data.msg ]
        // }
        // PythonShell.run('nlp.py', options, (err, results) => {
        //     if (err) throw err;
        //     // results is an array consisting of messages collected during execution
        //     console.log(results[0]);
        // })
        var message = data.msg;
        var normailzed_message = (0, _compromise2.default)(data.msg).normalize().out('text');
        var verbs = (0, _compromise2.default)(normailzed_message).verbs().out('array');
        var nouns = (0, _compromise2.default)(normailzed_message).nouns().out('array').length;
        var isQuestion = (0, _compromise2.default)(normailzed_message).questions().out('array').length > 0;
        console.log('\uD83D\uDC31\u200D\uD83D\uDC64Verbs:\n' + verbs + '\n\u2728Nouns:\n' + nouns + '\n\uD83D\uDE4B\u200DQuestion:\n' + isQuestion);
        socket.emit('reply', { message: data.msg });
    });
});

// tell our app to listen to our port
app.server.listen(process.env.PORT || PORT, function (_) {
    return console.log('Magic happens on ' + app.server.address().port);
});
//# sourceMappingURL=index.js.map