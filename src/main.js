import Phaser from "phaser";
import Test from "./test.js";

const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 450,
  backgroundColor: "#ffffff",
  parent: "app",
  scene: [Test]
};

new Phaser.Game(config);