class Graphics {
  constructor(canvas) {
    this.canvas = canvas;
  }

  init = (graph) => {
    const engine = new BABYLON.Engine(this.canvas, true);
    const scene = this.createScene(engine, graph);
    engine.runRenderLoop(() => {
      scene.render();
    });
  };

  updateEdge = (edge, nodeA, nodeB) => {
    edge.position = nodeA.position.add(nodeB.position).scale(0.5);
    edge.lookAt(nodeA.position, 0, Math.PI / 2);
    edge.scaling.y = BABYLON.Vector3.Distance(nodeA.position, nodeB.position) / 2;
  };

  getNodeName = (id) => {
    return `node_${id}`;
  };

  getNodeId = (name) => {
    return +name.split("_")[1];
  };

  getEdgeName = (idA, idB) => {
    return `edge_${idA}_${idB}`;
  };

  getEdgeIds = (name) => {
    return name
      .split("_")
      .slice(1)
      .map((v) => parseInt(v, 10));
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
    const sphereRadius = 0.3;
    const sphereSegments = 16;
    const cylinderRadius = 0.05;

    const nodes = {};
    graph.forEachNode((graphNode) => {
      const name = this.getNodeName(graphNode.id);
      const attributes = { diameter: sphereRadius * 2, segments: sphereSegments };
      const node = BABYLON.MeshBuilder.CreateSphere(name, attributes, scene);
      nodes[graphNode.id] = node;
      node.position = this.createRandomPosition();
      shadowGenerator.getShadowMap().renderList.push(node);
    });

    const edgeSets = [];
    graph.forEachEdge((graphEdge) => {
      const idA = graphEdge.nodeA.id;
      const idB = graphEdge.nodeB.id;
      const name = this.getEdgeName(this.getNodeId(nodes[idA].name), this.getNodeId(nodes[idB].name));
      const edge = BABYLON.MeshBuilder.CreateCylinder(name, { diameter: cylinderRadius * 2 }, scene);
      shadowGenerator.getShadowMap().renderList.push(edge);
      edgeSets.push([edge, nodes[idA], nodes[idB]]);
    });

    scene.registerBeforeRender(() => {
      edgeSets.forEach((edgeSet, i) => {
        const st = Math.sin(performance.now() / 900 + i);
        const ct = Math.cos(performance.now() / 900 + i);
        const [edge, nodeA, nodeB] = edgeSet;
        nodeA.position.x += ct / 100;
        nodeA.position.y += st / 100;
        nodeA.position.z += (st * ct) / 100;
        this.updateEdge(edge, nodeA, nodeB);
      });
    });
  };

  createScene = (engine, graph) => {
    const scene = new BABYLON.Scene(engine);

    const cameraPosition = new BABYLON.Vector3(0, 10, -35);
    const cameraTarget = new BABYLON.Vector3(0, 10, 0);
    const camera = new BABYLON.FreeCamera("camera", cameraPosition, scene);
    camera.setTarget(cameraTarget);
    camera.keysUp.push(87); // W
    camera.keysLeft.push(65); // A
    camera.keysDown.push(83); // S
    camera.keysRight.push(68); // D
    camera.attachControl(this.canvas, true);

    // Environment

    const lightPosition = new BABYLON.Vector3(0, 70, 0);
    const light = new BABYLON.PointLight("light", lightPosition, scene);
    light.intensity = 0.7;

    const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
    shadowGenerator.usePoissonSampling = true;

    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    ground.receiveShadows = true;

    // Graph

    this.createGraph(scene, shadowGenerator, graph);

    return scene;
  };
}

export default Graphics;
