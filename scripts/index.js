import GraphFactory from "./simulation/graph-factory.js";
import { GraphFormats, logRepr, logSummary } from "./simulation/graph-logging.js";
import Orchestrator from "./orchestration/orchestrator.js";

// GraphFactory.fetchSimple().then((graph) => {
// const graphName = GraphFactory.MISERABLES;
const graphName = GraphFactory.SYNTHETIC;
GraphFactory.fetch(graphName).then((graph) => {
  // logRepr(graph, GraphFormats.MATRIX);
  // logRepr(graph, GraphFormats.LIST);
  logSummary(graph);

  const canvas = document.getElementById("canvas");
  const orchestrator = new Orchestrator(canvas, graph);
  orchestrator.start();
});
