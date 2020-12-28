import Graph from "../simulation/graph.js";

class GraphFactory {
  static fetch = async () => {
    const dataUrl = "https://chrisgregory.blob.core.windows.net/datasets/les-miserables.json";
    const graphData = await fetch(dataUrl, {
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then((response) => response.json());

    const graph = new Graph();
    const indexMap = {};
    graphData.nodes.forEach((node, i) => {
      indexMap[node.id] = i;
      graph.addNode(i, { name: node.id, group: node.group });
    });
    graphData.links.forEach((edge) => {
      graph.addEdge(indexMap[edge.source], indexMap[edge.target], false, edge.value);
    });
    return graph;
  };

  static fetchSimple = async () => {
    return new Promise((resolve, reject) => resolve(GraphFactory.createSimple()));
  };

  static createSimple = () => {
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

    return graph;
  };
}

export default GraphFactory;
