import Graph from "../simulation/graph.js";

class GraphFactory {
  SYNTHETIC = "synthetic";
  MISERABLES = "miserables";

  static fetch = async (graphName) => {
    switch (graphName) {
      case GraphFactory.SYNTHETIC:
        return GraphFactory.fetchSynthetic();
      case GraphFactory.MISERABLES:
        return GraphFactory.fetchMiserables();
      default:
        console.error(`Graph name ${graphName} is invalid`);
    }
  };

  static fetchSynthetic = async () => {
    const graph = new Graph();
    graph.addNode("a", { size: "big" });
    graph.addNode("b", { size: "small" });
    graph.addNode("c", { size: "small" });
    graph.addNode("d", { size: "big" });
    graph.addNode("e", { size: "small" });
    graph.addNode("f", { size: "small" });

    ["b", "c"].forEach((id) => {
      graph.addEdge("a", id);
    });
    ["a", "b", "e", "f"].forEach((id) => {
      graph.addEdge("d", id);
    });

    return new Promise((resolve, reject) => resolve(graph));
  };

  static fetchMiserables = async () => {
    const dataUrl = "https://chrisgregory.blob.core.windows.net/datasets/les-miserables.json";
    const graphData = await fetch(dataUrl, {
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then((response) => response.json());

    const graph = new Graph();
    const indexMap = {};
    graphData.nodes.forEach((node, i) => {
      const id = `${i}`;
      indexMap[node.id] = id;
      graph.addNode(id, { name: node.id, group: node.group });
    });
    graphData.links.forEach((edge) => {
      graph.addEdge(indexMap[edge.source], indexMap[edge.target], false, edge.value);
    });
    return graph;
  };
}

export default GraphFactory;
