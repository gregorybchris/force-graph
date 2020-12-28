import Orchestrator from "./orchestration/orchestrator.js";

const canvas = document.getElementById("canvas");
const orchestrator = new Orchestrator(canvas);
orchestrator.start();
