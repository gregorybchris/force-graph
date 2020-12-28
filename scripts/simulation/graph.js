import Edge from "./edge.js";
import Node from "./node.js";

class Graph {
  constructor() {
    this.nodes = {};
  }

  getNumNodes = () => Object.keys(this.nodes).length;

  hasNode = (id) => this.nodes.hasOwnProperty(id);

  addNode = (id, data = {}) => {
    this.nodes[id] = new Node(id, data);
  };

  getNode = (id) => {
    this.assertValidNode(id);
    return this.nodes[id];
  };

  assertValidNode = (id) => {
    if (!this.hasNode(id)) {
      console.error(`Graph has no node with id ${id}`);
    }
  };

  assertValidNodes = (ids) => {
    ids.forEach((id) => {
      this.assertValidNode(id);
    });
  };

  addEdge = (idA, idB, directed = false, weight = 1, data = {}) => {
    this.assertValidNodes([idA, idB]);
    const nodeA = this.nodes[idA];
    const nodeB = this.nodes[idB];
    const edge = new Edge(nodeA, nodeB, directed, weight, data);
    nodeA.addEdge(edge);
    nodeB.addEdge(edge);
  };

  forEachEdge = (callback) => {
    const seenNodes = new Set();
    let edgeNumber = 0;
    for (let id in this.nodes) {
      const node = this.nodes[id];
      for (let childId in node.edges) {
        if (!seenNodes.has(childId)) {
          const edge = node.edges[childId];
          callback(edge, edgeNumber);
          edgeNumber++;
        }
      }
      seenNodes.add(id);
    }
  };

  forEachNode = (callback) => {
    let nodeNumber = 0;
    for (let id in this.nodes) {
      const node = this.nodes[id];
      callback(node, nodeNumber);
      nodeNumber++;
    }
  };
}

export default Graph;
