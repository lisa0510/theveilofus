import Phaser from "phaser";

export default class Customer extends Phaser.Scene {
  constructor() {
    super("Customer");
  }

  preload() {
    this.load.image("coffee1", "./assets/coffe/coffe1.jpg");
    this.load.image("coffee2", "./assets/coffe/coffe2.jpg");
  }

  create() {

    const { centerX, centerY } = this.cameras.main;
    const width = this.scale.width
    const height = this.scale.height


    this.add.text(centerX, 200, "Customer Dialogue", {
      fontSize: "40px"
    }).setOrigin(0.5);


    const coffee = this.add.image(width * 0.8, height * 0.2, "coffee1");
    coffee.setScale(0.3);
    coffee.setInteractive();

    let state = 1;


    coffee.on("pointerdown", () => {

      if (state === 1) {
        coffee.setTexture("coffee2");
        state = 2;
      } else {
        coffee.setTexture("coffee1");
        state = 1;
      }

    });

    const button = this.add.rectangle(centerX, centerY, 250, 100, 0xffffff);
    button.setInteractive({ useHandCursor: true });

    const text = this.add
      .text(centerX, centerY, "CoffeeBar", {
        fontSize: "30px",
        color: "#000"
      })
      .setOrigin(0.5);

    button.on("pointerdown", () => {
      this.scene.start("CoffeeBar");
    });


    
  }
}