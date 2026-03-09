import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {

    const { centerX, centerY } = this.cameras.main;

    const button = this.add.rectangle(centerX, centerY, 250, 100, 0xffffff);
    button.setInteractive({ useHandCursor: true });

    const text = this.add
      .text(centerX, centerY, "Start Game", {
        fontSize: "30px",
        color: "#000"
      })
      .setOrigin(0.5);

    button.on("pointerdown", () => {
      this.scene.start("CoffeeBar");
    });

  }
}