// scenes/Ending.js
import Phaser from "phaser";
import { endingData } from "../data/endingData.js";

export default class Ending extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  preload() {
  }

  create(data) {
    const { width, height } = this.scale;

    const endingKey = data.ending;
    const currentEnding = endingData[endingKey];

    this.add.text(
      width / 2,
      height * 0.78,
      currentEnding.text,
      {
        fontSize: "26px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 25, y: 18 },
        align: "center",
        wordWrap: { width: width * 0.7 }
      }
    ).setOrigin(0.5);
  }
}