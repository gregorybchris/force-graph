class Edge {
  constructor(nodeA, nodeB, directed = false, weight = 1, data = {}) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.directed = directed;
    this.weight = weight;
    this.data = data;
  }
}

export default Edge;
