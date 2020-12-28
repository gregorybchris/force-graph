class Node {
  static DEFAULT_RADIUS = 0.3;
  static DEFAULT_SEGMENTS = 16;

  constructor(id, scene, shadowGenerator, radius = Node.DEFAULT_RADIUS, segments = Node.DEFAULT_SEGMENTS) {
    this.id = id;
    this.name = `node_${id}`;
    const attributes = { diameter: radius * 2, segments: segments };
    this.mesh = BABYLON.MeshBuilder.CreateSphere(this.name, attributes, scene);
    shadowGenerator.getShadowMap().renderList.push(this.mesh);
  }
}

export default Node;
