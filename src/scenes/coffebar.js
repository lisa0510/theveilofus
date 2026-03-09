import Phaser from "phaser";

export default class CoffeeBar extends Phaser.Scene {
  constructor() {
    super("CoffeeBar");
  }

  create() {

    const { centerX, centerY } = this.cameras.main;

    this.add.text(centerX, 200, "Coffee Bar", {
      fontSize: "40px"
    }).setOrigin(0.5);

    const button = this.add.rectangle(centerX, centerY, 250, 100, 0x8b668b);
    button.setInteractive();

    const text2 = this.add
      .text(centerX, centerY, "Back to Menu", {
        fontSize: "25px",
        color: "#000"
      })
      .setOrigin(0.5);

    button.on("pointerdown", () => {
      this.scene.start("Menu");
    });

  }
}