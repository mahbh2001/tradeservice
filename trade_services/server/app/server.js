"use strict";
exports.__esModule = true;
var MicrosecondsTimer = require('microseconds');
var NanoTimer = require('nanotimer');
var zmq_1 = require("zmq");
var crypto_js_1 = require("crypto-js");
var address = process.env.ZMQ_BIND_ADDRESS || "tcp://127.0.0.1:3000";
var TradeGenerator = /** @class */ (function () {
    function TradeGenerator(zeroMqIpPort, tradeGenerationTime) {
        this.numTrades = 0;
        this.nenoTimer = new NanoTimer();
        this.zmqSocket = zmq_1.createSocket('push');
        this.zmqSocket.bindSync(zeroMqIpPort);
        this.tradeGenerationTime = tradeGenerationTime;
    }
    TradeGenerator.prototype.StartTrade = function () {
        this.nenoTimer.setInterval(this.Tradefunction.bind(this), '', trades.tradeGenerationTime);
    };
    TradeGenerator.prototype.Tradefunction = function () {
        this.numTrades++;
        var timeNow = MicrosecondsTimer.now();
        var trade = "Commodity: 'GOLD', UnitPrice: '100.23', Currency: 'RUBLE', Quantity: '100'";
        var sha256 = crypto_js_1.SHA256(timeNow + "-" + trade).toString();
        //console.log( timeNow + "-" + sha256);     
        this.zmqSocket.send(timeNow + "-" + sha256);
    };
    return TradeGenerator;
}());
exports.TradeGenerator = TradeGenerator;
var trades = new TradeGenerator(address, '1m');
trades.StartTrade();
