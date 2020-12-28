const GraphFormats = {
  LIST: "list",
  MATRIX: "matrix",
};
Object.freeze(GraphFormats);

const logSummary = (graph) => {
  const summary = {};

  summary.edgeCount = 0;
  summary.edgeWeightMin = Number.MAX_VALUE;
  summary.edgeWeightMax = Number.MIN_VALUE;
  graph.forEachEdge((edge) => {
    summary.edgeCount++;
    summary.edgeWeightMin = Math.min(edge.weight, summary.edgeWeightMin);
    summary.edgeWeightMax = Math.max(edge.weight, summary.edgeWeightMax);
  });

  summary.nodeCount = graph.getNumNodes();
  let totalDegree = 0;
  summary.nodeDegreeMin = Number.MAX_VALUE;
  summary.nodeDegreeMax = 0;
  graph.forEachNode((node) => {
    const nodeDegree = Object.keys(node.edges).length;
    totalDegree += nodeDegree;
    summary.nodeDegreeMax = Math.max(nodeDegree, summary.nodeDegreeMax);
    summary.nodeDegreeMin = Math.min(nodeDegree, summary.nodeDegreeMin);
  });
  summary.nodeDegreeMean = totalDegree / summary.nodeCount;

  console.log("Graph summary: ", summary);
};

const logRepr = (graph, format = GraphFormats.LIST) => {
  if (!Object.values(GraphFormats).includes(format)) {
    console.error(`Display format ${format} is not valid`);
  }

  if (format == GraphFormats.LIST) {
    graph.forEachNode((node) => {
      console.log(`${node.id} -> [${Object.keys(node.edges)}]`);
    });
  } else if (format == GraphFormats.MATRIX) {
    const nodeIds = Object.keys(graph.nodes);
    const numNodes = nodeIds.length;
    const indexMap = Object.fromEntries(nodeIds.map((x, i) => [x, i]));
    const matrix = Array.from(Array(numNodes), () => new Array(numNodes).fill(0));
    graph.forEachEdge((edge) => {
      matrix[indexMap[edge.nodeA.id]][indexMap[edge.nodeB.id]] = 1;
      if (!edge.directed) {
        matrix[indexMap[edge.nodeB.id]][indexMap[edge.nodeA.id]] = 1;
      }
    });
    const matrixString = matrix.map((row) => row.map((cell) => (cell == 1 ? "@" : ".")).join(" ")).join("\n");
    console.log(matrixString);
    console.log(indexMap);
  } else {
    console.error(`Display format ${format} is not valid`);
  }
};

export { GraphFormats, logSummary, logRepr };
