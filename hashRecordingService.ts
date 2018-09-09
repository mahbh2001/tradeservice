import {Socket, createSocket} from "zmq";
var MicrosecondsTimer = require('microseconds');
const loki = require("lokijs");

const address = process.env.ZMQ_PUB_ADDRESS || `tcp://127.0.0.1:3000`;

export class TradeRecoder
{
    zmqSocket: Socket;
    database: any;
    db_table: any;
    minDuration: Number | undefined;
    maxDuration: Number | undefined;

    constructor(zeroMqIpPort : string)
    {
        this.zmqSocket = createSocket('pull');;
         this.zmqSocket.connect(zeroMqIpPort);
        this.database =new loki("quickstart.db");
        this.db_table = this.database.addCollection('TRADES');
    }

    StartService()
    {
        this.zmqSocket.on(`message`, function(msg) {
            
            var parts = msg.toString().split('-');
            console.log(parts);
            // save to in-memory lokidb
            this.db_table.insert({ID: parts[0], HASH: parts[1]});

            var timeTaken = MicrosecondsTimer.now() - parts[0];
            if (this.minDuration == undefined) this.minDuration = timeTaken;
            if (this.maxDuration == undefined) this.maxDuration = timeTaken;

            if(timeTaken < this.minDuration) this.minDuration = timeTaken;
            if(timeTaken > this.maxDuration ) this.maxDuration = timeTaken;

        }.bind(this));
    }
}

var recorder = new TradeRecoder(address);
recorder.StartService();