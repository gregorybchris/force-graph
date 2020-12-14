const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true);

const updateEdge = (edge, nodeA, nodeB) => {
  edge.position = nodeA.position.add(nodeB.position).scale(0.5);
  edge.lookAt(nodeA.position, 0, Math.PI / 2);
  edge.scaling.y = nodeA.position.subtract(nodeB.position).length() / 2;
};

const createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 3, -10),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.keysUp.push(87); //W
  camera.keysDown.push(83); //D
  camera.keysLeft.push(65); //A
  camera.keysRight.push(68); //S
  camera.attachControl(canvas, true);

  const light = new BABYLON.PointLight(
    "light",
    new BABYLON.Vector3(1, 10, 1),
    scene
  );
  light.intensity = 0.7;
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  shadowGenerator.usePoissonSampling = true;
  // shadowGenerator.useExponentialShadowMap = true;
  // shadowGenerator.useBlurExponentialShadowMap = true;

  scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
  );
  ground.receiveShadows = true;

  const node1 = BABYLON.MeshBuilder.CreateSphere(
    "node1",
    { diameter: 1, segments: 32 },
    scene
  );
  const node2 = BABYLON.MeshBuilder.CreateSphere(
    "node2",
    { diameter: 1, segments: 32 },
    scene
  );

  node1.position = new BABYLON.Vector3(
    Math.random(),
    Math.random(),
    Math.random()
  );
  node2.position = node1.position.add(
    new BABYLON.Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2)
  );

  const edge1 = BABYLON.MeshBuilder.CreateCylinder("edge1", {
    diameter: 0.2,
  });
  edge1.position = new BABYLON.Vector3();

  shadowGenerator.getShadowMap().renderList.push(edge1);
  shadowGenerator.getShadowMap().renderList.push(node1);
  shadowGenerator.getShadowMap().renderList.push(node2);

  scene.registerBeforeRender(() => {
    const st = Math.sin(performance.now() / 900);
    const ct = Math.cos(performance.now() / 900);
    node1.position = new BABYLON.Vector3(0, 2, 0);
    node2.position = new BABYLON.Vector3(2 * ct, 2 + st * ct, 2 * st);
    // node1.position = new BABYLON.Vector3(st * st + ct, ct * st, ct);
    // node2.position = new BABYLON.Vector3(st * ct * ct, ct + st, st * ct * st);

    updateEdge(edge1, node1, node2);
  });

  return scene;
};

const scene = createScene();
engine.runRenderLoop(function () {
  scene.render();
});
