const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);

const updateEdge = (edge, nodeA, nodeB) => {
  edge.position = nodeA.position.add(nodeB.position).scale(0.5);
  edge.lookAt(nodeA.position, 0, Math.PI / 2);
  edge.scaling.y = BABYLON.Vector3.Distance(nodeA.position, nodeB.position) / 2;
};

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const cameraPosition = new BABYLON.Vector3(0, 10, -35);
  const cameraTarget = new BABYLON.Vector3(0, 10, 0);
  const camera = new BABYLON.FreeCamera("camera", cameraPosition, scene);
  camera.setTarget(cameraTarget);
  camera.keysUp.push(87); // W
  camera.keysDown.push(83); // D
  camera.keysLeft.push(65); // A
  camera.keysRight.push(68); // S
  camera.attachControl(canvas, true);

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

  const getNodeName = (number) => {
    return `node_${number}`;
  };

  const getNodeNumber = (name) => {
    return +name.split("_")[1];
  };

  const getEdgeName = (numberA, numberB) => {
    return `edge_${numberA}_${numberB}`;
  };

  const getEdgeNumbers = (name) => {
    return name
      .split("_")
      .slice(1)
      .map((v) => parseInt(v, 10));
  };

  const createRandomPosition = () => {
    const [xRange, yRange, zRange] = [7, 7, 7];
    const [xOffset, yOffset, zOffset] = [0, 10, 0];
    const x = (Math.random() - 0.5) * 2 * xRange + xOffset;
    const y = (Math.random() - 0.5) * 2 * yRange + yOffset;
    const z = (Math.random() - 0.5) * 2 * zRange + zOffset;
    return new BABYLON.Vector3(x, y, z);
  };

  const nodes = [];
  const numNodes = 50;
  for (let i = 0; i < numNodes; i++) {
    const name = getNodeName(i);
    const radius = 0.3;
    const segments = 16;
    const node = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius * 2, segments: segments }, scene);
    nodes.push(node);
    node.position = createRandomPosition();
    shadowGenerator.getShadowMap().renderList.push(node);
  }

  const edges = [];
  const edgeProbability = 0.05;
  nodes.forEach((nodeA) => {
    nodes.forEach((nodeB) => {
      if (Math.random() < edgeProbability) {
        const numberA = getNodeNumber(nodeA.name);
        const numberB = getNodeNumber(nodeB.name);
        const name = getEdgeName(numberA, numberB);
        const radius = 0.05;
        const edge = BABYLON.MeshBuilder.CreateCylinder(name, { diameter: radius * 2 }, scene);
        edges.push([edge, nodeA, nodeB]);
        shadowGenerator.getShadowMap().renderList.push(edge);
      }
    });
  });

  scene.registerBeforeRender(() => {
    edges.forEach((edgeSet, i) => {
      const st = Math.sin(performance.now() / 900 + i);
      const ct = Math.cos(performance.now() / 900 + i);
      const [edge, nodeA, nodeB] = edgeSet;
      nodeA.position.x += ct / 100;
      nodeA.position.y += st / 100;
      nodeA.position.z += (st * ct) / 100;
      updateEdge(edge, nodeA, nodeB);
    });
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
