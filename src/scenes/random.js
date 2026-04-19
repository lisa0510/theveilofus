export default class Random extends Phaser.Scene {
  constructor() {
    super("Random");
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0xf4e6c8);
    this.add.text(width / 2, height / 2, "Scene 2", {
      fontSize: "24px",
      fontFamily: "cursive",
      color: "#333333"
    }).setOrigin(0.5);
  }
}