import Phaser from "phaser";

export default class Customer extends Phaser.Scene {
  constructor() {
    super("Customer");
  }

  init(data) {
    this.customerData = data.customer;
  }

  preload() {
    this.load.image("shop", "/assets/customer/shop.jpg");
    this.load.image("jinx", "/assets/customer/jinx.png");
    this.load.image("lukas", "/assets/customer/lukas.png");
    this.load.image("laura", "/assets/customer/laura.png");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const width = this.scale.width;
    const height = this.scale.height;

    // Hintergrund
    const bg = this.add.image(centerX, centerY, "shop");
    bg.setDisplaySize(width, height);

    // Customer Bild
    const customer = this.add.image(
      centerX,
      centerY - height * 0.08,
      this.customerData.image
    );
    customer.setScale(0.3);

    // Dialogbox
    const dialogueBoxY = centerY + height * 0.22;

    const dialogueBox = this.add.rectangle(
      centerX,
      dialogueBoxY,
      width * 0.5,
      height * 0.18,
      0xffffff,
      0.9
    );
    dialogueBox.setStrokeStyle(2, 0x000000);

    // Name
    this.add.text(centerX, dialogueBoxY - 35, this.customerData.name, {
      fontSize: "28px",
      color: "#000000",
      fontStyle: "bold",
      margintop: "30px"
    }).setOrigin(0.5);

    // Dialogue
    this.add.text(centerX, dialogueBoxY, this.customerData.dialogue, {
      fontSize: "24px",
      color: "#222222",
      align: "center",
      wordWrap: { width: width * 0.42 }
    }).setOrigin(0.5);

    // Button zu CoffeeBar
    const button = this.add.rectangle(width * 0.95, height * 0.55, 100, 100, 0xffffff);
    button.setInteractive({ useHandCursor: true });

    this.add.text(width * 0.95, height * 0.55, "CoffeeBar", {
      fontSize: "15px",
      color: "#000"
    }).setOrigin(0.5);

    button.on("pointerdown", () => {
      this.scene.start("CoffeeBar", {
        customer: this.customerData,
        order: this.customerData.order
      });
    });

    button.on("pointerover", () => {
      button.setFillStyle(0x5a3e36);
    });
  }
}