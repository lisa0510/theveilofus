import Phaser from "phaser";
import datacustomers from "../datacustomers.js";

export default class CustomerDialogue extends Phaser.Scene {
  constructor() {
    super("Customer");
  }

  init(data) {
    this.customerIndex = data.customerIndex ?? 0;
    this.served = data.served || false;
    this.customerData = datacustomers[this.customerIndex];
  }

  preload() {
    this.load.image("shop", "/assets/customer/shop.jpg");
    this.load.image("lukarde", "/assets/customer/lukarde.jpg");
    this.load.image("laura", "/assets/customer/laura.jpg");
    this.load.image("elizabeth", "/assets/customer/elizabeth.jpg");
    this.load.image("klara", "/assets/customer/klara.jpg");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    const bg = this.add.image(centerX, centerY, "shop");
    bg.setDisplaySize(width, height);

    // Customer image
    const customerImage = this.add.image(
      centerX,
      centerY - height * 0.08,
      this.customerData.image
    );
    customerImage.setScale(0.3);

    // Dialogue content
    let dialogueText = this.customerData.dialogue;
    let orderText = `Order: ${this.customerData.order}`;
    let buttonLabel = "CoffeeBar";

    if (this.served) {
      dialogueText = this.customerData.reaction || "Thanks for the coffee.";
      orderText = "";
      buttonLabel = "Continue";
    }

    // Dialogue box position
    const boxY = centerY + height * 0.23;
    const boxWidth = width * 0.52;
    const boxHeight = height * 0.2;
    const padding = 30;

    // Main dialogue box
    const box = this.add.rectangle(
      centerX,
      boxY,
      boxWidth,
      boxHeight,
      0xf8f1e7,
      0.96
    );
    box.setStrokeStyle(3, 0x3b2a24);

    // Name
    this.add.text(centerX, boxY - boxHeight * 0.28, this.customerData.name, {
      fontSize: "28px",
      color: "#3b2a24",
      fontStyle: "bold"
    }).setOrigin(0.5);

    // Dialogue
    this.add.text(centerX, boxY - 5, dialogueText, {
      fontSize: "24px",
      color: "#222222",
      align: "center",
      wordWrap: { width: boxWidth - padding * 2 }
    }).setOrigin(0.5);

    // Order text only before coffee is served
    if (!this.served) {
      this.add.text(centerX, boxY + boxHeight * 0.28, orderText, {
        fontSize: "22px",
        color: "#6b4d3a"
      }).setOrigin(0.5);
    }

    // Button
    const buttonX = width * 0.9;
    const buttonY = height * 0.80;
    const button = this.add.rectangle(
      buttonX,
      buttonY,
      200,
      100,
      0xffffff,
      1
    );
    button.setStrokeStyle(2, 0x3b2a24);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(buttonX, buttonY, buttonLabel, {
      fontSize: "30px",
      color: "#000000"
    }).setOrigin(0.5);

    button.on("pointerover", () => {
      button.setFillStyle(0xeadfd1);
    });

    button.on("pointerout", () => {
      button.setFillStyle(0xffffff);
    });

    button.on("pointerdown", () => {
      if (!this.served) {
        this.scene.start("CoffeeBar", {
          customerIndex: this.customerIndex
        });
      } else {
        const nextIndex = this.customerIndex + 1;

        if (nextIndex < datacustomers.length) {
          this.scene.start("Customer", {
            customerIndex: nextIndex
          });
        } else {
          this.scene.start("Menu");
        }
      }
    });
  }
}