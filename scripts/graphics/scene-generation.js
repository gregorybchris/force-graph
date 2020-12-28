const createScene = (engine, canvas) => {
  const scene = new BABYLON.Scene(engine);

  const cameraPosition = new BABYLON.Vector3(0, 10, -35);
  const cameraTarget = new BABYLON.Vector3(0, 10, 0);
  const camera = new BABYLON.FreeCamera("camera", cameraPosition, scene);
  camera.setTarget(cameraTarget);
  camera.keysUp.push(87); // W
  camera.keysLeft.push(65); // A
  camera.keysDown.push(83); // S
  camera.keysRight.push(68); // D
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

  return [scene, shadowGenerator];
};

export { createScene };
