import EdgeDirections from "./edge-directions.js";

class Node {
  constructor(id, data = {}) {
    this.id = id;
    this.data = data;
    this.edges = {};
  }

  hasEdge = (id, direction = EdgeDirections.ANY) => {
    if (!Object.values(EdgeDirections).includes(direction)) {
      console.error(`Edge direction ${direction} is invalid`);
    }

    if (!this.edges.hasOwnProperty(id)) {
      return false;
    }

    const edge = this.edges[id];
    switch (direction) {
      case EdgeDirections.ANY:
        return true;
      case EdgeDirections.UNDIRECTED:
        return !edge.directed;
      case EdgeDirections.IN:
        return edge.directed && edge.nodeA.id === this.id;
      case EdgeDirections.OUT:
        return edge.directed && edge.nodeB.id === this.id;
      default:
        console.error(`Edge direction ${direction} is invalid`);
    }

    return true;
  };

  assertValidEdge = (id) => {
    if (!this.hasEdge(id)) {
      console.error(`Graph node has no edge to node with id ${id}`);
    }
  };

  getEdge = (id) => {
    this.assertValidEdge(id);
    return this.edges[id];
  };

  getChild = (edge) => {
    if (!edge.nodeA.id === this.id && !edge.nodeB.id === this.id) {
      console.error("Cannot get other node from unrelated edge");
    }
    return edge.nodeA.id === this.id ? edge.nodeB : edge.nodeA;
  };

  addEdge = (edge) => {
    const other = this.getChild(edge);
    if (this.hasEdge(other.id)) {
      console.error(`Node ${this.id} already has an edge to ${other.id}`);
    }
    this.edges[other.id] = edge;
  };

  removeEdge = (id) => {
    if (!this.hasEdge(id)) {
      console.error(`Node ${this.id} doesn't have an edge to ${id}`);
    }

    delete this.edges[id];
  };
}

export default Node;
