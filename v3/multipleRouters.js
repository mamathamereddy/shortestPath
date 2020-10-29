
// gets all the required packages/dependencies for this file
let data = require("../data.json");
const Router = require("./routerV3");
const Packet = require("./packet");
const prompt = require('prompt'); 
const jsgraphs = require('js-graph-algorithms');

//creates the routers array

let routers = [];

const multipleRouters = () => {
    /**
     * 1. Iterate through the data and create the routers from it 
     * as well as add it to our array.
     */
   
     //iterates data and creates the routers 
     data.routers.forEach(router => {

        let r = new Router (router.router, router.connections)

        //Push to array
        routers.push(r);
     });


    /**
     * 2. build a weighted directional graph and adds the edges 
     * between the nodes through the data.json file
     */

     //creates the graph 
    let g = new jsgraphs.WeightedDiGraph(data.routers.length);
     
    // loops through the router data
    for (var i=0; i<data.routers.length; i++) {
     
    // adds routers to array
     var r = data.routers[i];
     r.connections.forEach( c => {

    // adds the edges to the graph
        g.addEdge(new jsgraphs.Edge(i, c.to, c.cost))

     });
    };

    /**
     * 3. create a new packet. 
     * create a packet with a name, a source, a destination and a ttl.
     * the source should be 0, destination 3 and ttl > 3. 
     * the name can be whatever you'd like.
     */

    let demoPacket = new Packet ("Wilderbeast", 0, 3, 4);
     

    // Add the shortest path to the packet.
    demoPacket.shortestPath = getShortestPath(g, demoPacket.source, demoPacket.destination, demoPacket.ttl);

    /**
     * Prompt is a package to prompt the user though the terminal.
     * Can be found here: https://github.com/flatiron/prompt#readme
     */
    prompt.start();
    console.log("demo packet initialized. Send packet? (yes please/no)")
    prompt.get(["sendPacket"], function(err, res) {

        // if yes to sending packet
        if(res.sendPacket == "yes please") {

            //forwards the packet and which source
            demoPacket.forwardPacket(demoPacket.source);
        }
        // if no to sending packet
        else {
            console.log("Please and Thankyou are magic words ;) - Type yes please")
            process.exit(1);
        }
    })
}

/**
 * This methods gets the router names / indexes on the shortest path.
 */
const getShortestPath = (graph, from, to)  => {
    // 4. implement this.
    lp = [];
    
    let dijkstra = new jsgraphs.Dijkstra(graph, from) 
    if(dijkstra.hasPathTo(to)){
        let path = dijkstra.pathTo(to)
            for (let i = 0; i < path.length; i++) {
                let edge = path[i]
                    lp.push(edge.to())
            }  
            return lp
        } else {
            return null;
        }
}

//function is run
multipleRouters();
