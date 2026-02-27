import Phaser from "phaser";

export default class Test extends Phaser.Scene {
  constructor() {
    super("Test");
  }

  create() {
    
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const button = this.add.rectangle(centerX, centerY, 300, 120, 0xffffff);
    button.setInteractive({ useHandCursor: true });
    const label = this.add
      .text(centerX, centerY, "CLICK ME", { fontSize: "32px", color: "#000000" })
      .setOrigin(0.5);

    //Eventlistener: Bei Klick auf Button wird die Farbe geändert   
    button.on("pointerdown", () => {
      const r = Phaser.Math.Between(0, 255);
      const g = Phaser.Math.Between(0, 255);
      const b = Phaser.Math.Between(0, 255);
    
      const color = Phaser.Display.Color.GetColor(r, g, b);
      button.setFillStyle(color);
    });
  }
}