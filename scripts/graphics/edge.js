class Edge {
  static DEFAULT_RADIUS = 0.05;

  constructor(idA, idB, scene, shadowGenerator, radius = Edge.DEFAULT_RADIUS) {
    this.idA = idA;
    this.idB = idB;
    this.name = Edge.getName(idA, idB);
    const attributes = { diameter: radius * 2 };
    this.mesh = BABYLON.MeshBuilder.CreateCylinder(this.name, attributes, scene);
    shadowGenerator.getShadowMap().renderList.push(this.mesh);
  }

  updateFromNodes = (nodeA, nodeB) => {
    this.mesh.position = nodeA.mesh.position.add(nodeB.mesh.position).scale(0.5);
    this.mesh.lookAt(nodeA.mesh.position, 0, Math.PI / 2);
    this.mesh.scaling.y = BABYLON.Vector3.Distance(nodeA.mesh.position, nodeB.mesh.position) / 2;
  };

  static getName = (idA, idB) => `edge_${idA}_${idB}`;

  static getIds = (name) => name.split("_").slice(1);
}

export default Edge;
