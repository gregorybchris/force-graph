class Simulator {
  constructor(embedding) {
    this.embedding = embedding;
    this.count = 0;
  }

  next = (deltaTime) => {
    if (this.count < 20) {
      console.log(deltaTime);
      this.count++;
    }
  };
}

export default Simulator;
