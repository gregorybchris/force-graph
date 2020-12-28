import { createScene } from "./scene-generation.js";
import Node from "./node.js";
import Edge from "./edge.js";

class Graphics {
  constructor(canvas) {
    this.canvas = canvas;
  }

  init = (graph) => {
    const engine = new BABYLON.Engine(this.canvas, true);
    const [scene, shadowGenerator] = createScene(engine, this.canvas);

    const edgeSets = this.createGraph(scene, shadowGenerator, graph);

    scene.registerBeforeRender(({ deltaTime }) => {
      edgeSets.forEach((edgeSet, i) => {
        const st = Math.sin(performance.now() / 900 + i);
        const ct = Math.cos(performance.now() / 900 + i);
        const [edge, nodeA, nodeB] = edgeSet;
        nodeA.mesh.position.x += ct / 100;
        nodeA.mesh.position.y += st / 100;
        nodeA.mesh.position.z += (st * ct) / 100;
        edge.updateFromNodes(nodeA, nodeB);
      });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  createRandomPosition = () => {
    const [xRange, yRange, zRange] = [7, 7, 7];
    const [xOffset, yOffset, zOffset] = [0, 10, 0];
    const x = (Math.random() - 0.5) * 2 * xRange + xOffset;
    const y = (Math.random() - 0.5) * 2 * yRange + yOffset;
    const z = (Math.random() - 0.5) * 2 * zRange + zOffset;
    return new BABYLON.Vector3(x, y, z);
  };

  createGraph = (scene, shadowGenerator, graph) => {
    const nodes = {};
    graph.forEachNode((graphNode) => {
      const node = new Node(graphNode.id, scene, shadowGenerator);
      nodes[graphNode.id] = node;
      node.mesh.position = this.createRandomPosition();
    });

    const edgeSets = [];
    graph.forEachEdge((graphEdge) => {
      const nodeA = nodes[graphEdge.nodeA.id];
      const nodeB = nodes[graphEdge.nodeB.id];
      const edge = new Edge(nodeA.id, nodeB.id, scene, shadowGenerator);
      edgeSets.push([edge, nodeA, nodeB]);
    });

    return edgeSets;
  };
}

export default Graphics;
