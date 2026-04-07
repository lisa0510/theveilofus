import Phaser from "phaser";

export default class CoffeeBar extends Phaser.Scene {
  constructor() {
    super("CoffeeBar");
  }

  preload() {
    this.load.image("coffeeReady", "assets/coffe/blackcoffe.png");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2.3, height / 1.7, "coffeeReady")
      .setScale(0.2);
      
    console.log("Kaffeebar-Szene geladen!");
  }
}