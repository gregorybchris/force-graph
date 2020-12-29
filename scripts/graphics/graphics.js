import { createScene } from "./scene-generation.js";
import Node from "./node.js";
import Edge from "./edge.js";

class Graphics {
  constructor(canvas) {
    this.canvas = canvas;

    const engine = new BABYLON.Engine(this.canvas, true);
    const [scene, shadowGenerator] = createScene(engine, this.canvas);
    this.scene = scene;
    this.shadowGenerator = shadowGenerator;

    this.nodes = {};
    this.edgeSets = [];

    engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  onRender = (callback) => {
    this.scene.registerBeforeRender(({ deltaTime }) => {
      callback(deltaTime, this.nodes, this.edgeSets);
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

  addNode = (id) => {
    const node = new Node(id, this.scene, this.shadowGenerator);
    this.nodes[id] = node;
    node.mesh.position = this.createRandomPosition();
    node.mesh.actionManager = new BABYLON.ActionManager(this.scene);
    node.mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        {
          trigger: BABYLON.ActionManager.OnPickTrigger,
        },
        (action) => {
          const mesh = action.meshUnderPointer;
          const name = mesh.name;
          const id = Node.getId(name);
          console.log("Clicked node", name, id);
        }
      )
    );
  };

  addEdge = (idA, idB) => {
    const nodeA = this.nodes[idA];
    const nodeB = this.nodes[idB];
    const edge = new Edge(nodeA.id, nodeB.id, this.scene, this.shadowGenerator);
    this.edgeSets.push([edge, nodeA, nodeB]);
  };
}

export default Graphics;
