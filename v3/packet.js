// gets all the required packages/dependencies for this file

const seaport = require('seaport');
const ports = seaport.connect('localhost', 9090);
const fetch = require('node-fetch');

class Packet{
    constructor(id, source, destination, ttl, routingHistory=[], shortestPath = []) {
        this.id = id;
        this.source = source;
        this.destination = destination,
        this.ttl = ttl;
        this.routingHistory = routingHistory;
        this.shortestPath = shortestPath;
    }

    popShortestPath() {
        /**
         * What does shift do?
         * it removes the first element of the array.
         */
        return this.shortestPath.shift();
    }

    getTotalCost() {
        /**
         * How does reduce work?
         * the reduce() method returns a single value after iteating through the elements of the array, which reduces the array.
         */
        return this.routingHistory.reduce((acc, route) => acc+route.cost, 0);
    }

    addRouteToHistory(route) {
        this.routingHistory.push(route);
    }

    prettyPrint() {
        let out = "\nPacket source: router" + this.source;
        out += "\nPacket destination: router" + this.destination;
        out += "\nPacket reached destination and followed ";
        this.routingHistory.forEach(route => {
            out += "\n\trouter"+route.to + " at cost " + route.cost + ". ttl: " + route.ttl;
        }) 
        out += "\nTotal cost of: " + this.getTotalCost();
        console.log(out)

    }

    forwardPacket(to) {
        let sourceRouter = ports.query("router"+to)[0];
        var host = sourceRouter.host.split(":").reverse()[0];
        var port = sourceRouter.port;
        /**
         * node-fetch is a library to send http-requests. 
         * In this case, we use it to post / forward the package.
         * The documentation can be found here: 
         * https://github.com/node-fetch/node-fetch
         */
        fetch("http://" + host + ":" + port, {
            method: 'post',
            body:    JSON.stringify(this),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            if(json.msg) {
                console.log(json.msg);
            } else {
                let packet = new Packet(json.id, json.source, json.destination, json.ttl, json.routingHistory, json.shortestPath);
                packet.prettyPrint();
            }
            process.exit(1);
        });
    }
}

module.exports = Packet;