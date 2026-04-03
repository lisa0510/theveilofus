import Phaser from "phaser";

export default class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }


  create() {

     const { width, height } = this.scale;

    // Hintergrundfarbe oder Test-Text, damit du siehst, dass du da bist
    this.add.rectangle(0, 0, width, height, 0x3b2a24).setOrigin(0);

    this.add.text(width * 0.5, height * 0.4, "Kaffeebar Szene", {
      fontSize: "40px",
      color: "#f8f1e7",
      fontFamily: "cursive"
    }).setOrigin(0.5);

}
}
