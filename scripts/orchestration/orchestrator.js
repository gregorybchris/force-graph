import Graphics from "../graphics/graphics.js";
import Embedding from "../simulation/embedding.js";
import Simulator from "../simulation/simulator.js";

class Orchestrator {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;
    this.embedding = new Embedding(this.graph);
    this.simulator = new Simulator(this.embedding);
  }

  start = async () => {
    const graphics = new Graphics(this.canvas);
    this.graph.forEachNode((graphNode) => {
      graphics.addNode(graphNode.id);
    });
    this.graph.forEachEdge((graphEdge) => {
      graphics.addEdge(graphEdge.nodeA.id, graphEdge.nodeB.id);
    });
    graphics.onRender((deltaTime, nodes, edgeSets) => {
      this.updatePositions(deltaTime, nodes, edgeSets);
    });
  };

  updatePositions = (deltaTime, nodes, edgeSets) => {
    this.simulator.next(deltaTime);
    edgeSets.forEach((edgeSet, i) => {
      const st = Math.sin(performance.now() / 900 + i);
      const ct = Math.cos(performance.now() / 900 + i);
      const [edge, nodeA, nodeB] = edgeSet;
      nodeA.mesh.position.x += ct / 100;
      nodeA.mesh.position.y += st / 100;
      nodeA.mesh.position.z += (st * ct) / 100;
      edge.updateFromNodes(nodeA, nodeB);
    });
  };
}

export default Orchestrator;
