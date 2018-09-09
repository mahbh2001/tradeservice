"use strict";
exports.__esModule = true;
var zmq_1 = require("zmq");
var MicrosecondsTimer = require('microseconds');
var loki = require("lokijs");
var address = process.env.ZMQ_PUB_ADDRESS || "tcp://127.0.0.1:3000";
var TradeRecoder = /** @class */ (function () {
    function TradeRecoder(zeroMqIpPort) {
        this.zmqSocket = zmq_1.createSocket('pull');
        ;
        this.zmqSocket.connect(zeroMqIpPort);
        this.database = new loki("quickstart.db");
        this.db_table = this.database.addCollection('TRADES');
    }
    TradeRecoder.prototype.StartService = function () {
        this.zmqSocket.on("message", function (msg) {
            var parts = msg.toString().split('-');
            console.log(parts);
            // save to in-memory lokidb
            this.db_table.insert({ ID: parts[0], HASH: parts[1] });
            var timeTaken = MicrosecondsTimer.now() - parts[0];
            if (this.minDuration == undefined)
                this.minDuration = timeTaken;
            if (this.maxDuration == undefined)
                this.maxDuration = timeTaken;
            if (timeTaken < this.minDuration)
                this.minDuration = timeTaken;
            if (timeTaken > this.maxDuration)
                this.maxDuration = timeTaken;
        }.bind(this));
    };
    return TradeRecoder;
}());
exports.TradeRecoder = TradeRecoder;
var recorder = new TradeRecoder(address);
recorder.StartService();
