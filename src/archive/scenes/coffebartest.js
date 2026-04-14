import Phaser from "phaser";
import datacustomers from "../datacustomers.js";

export default class CoffeeBartest extends Phaser.Scene {
  constructor() {
    super("CoffeeBartest");
  }

  init(data) {
    this.customerIndex = data.customerIndex ?? 0;
    this.customerData = datacustomers[this.customerIndex];
    this.order = this.customerData.order;
  }

  preload() {
    this.load.image("coffeeReady", "/assets/coffe/blackcoffe.png");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const width = this.scale.width;
    const height = this.scale.height;

    this.cameras.main.setBackgroundColor("#e9dcc9");

    this.isCoffeeReady = false;
    this.isServed = false;

    this.add.text(centerX, height * 0.15, "Coffee Bar", {
      fontSize: "42px",
      color: "#2b1f1f"
    }).setOrigin(0.5);

    this.add.text(centerX, height * 0.25, `Order: ${this.order}`, {
      fontSize: "28px",
      color: "#000000"
    }).setOrigin(0.5);

    this.statusText = this.add.text(centerX, height * 0.4, "Press the button to make coffee", {
      fontSize: "24px",
      color: "#3b2a24"
    }).setOrigin(0.5);

    this.serveZone = this.add.rectangle(width * 0.8, height * 0.75, 180, 120, 0xffffff, 0.3);
    this.serveZone.setStrokeStyle(2, 0x000000);

    this.add.text(width * 0.8, height * 0.75, "Serve Here", {
      fontSize: "22px",
      color: "#000000"
    }).setOrigin(0.5);

    this.coffee = this.add.image(width * 0.5, height * 0.65, "coffeeReady");
    this.coffee.setScale(0.15);
    this.coffee.setVisible(false);
    this.coffee.setInteractive();

    this.input.setDraggable(this.coffee);

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this.coffee && this.isCoffeeReady && !this.isServed) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }
    });

    this.input.on("dragend", (pointer, gameObject) => {
      if (gameObject === this.coffee && this.isCoffeeReady && !this.isServed) {
        const distance = Phaser.Math.Distance.Between(
          gameObject.x,
          gameObject.y,
          this.serveZone.x,
          this.serveZone.y
        );

        if (distance < 100) {
          gameObject.x = this.serveZone.x;
          gameObject.y = this.serveZone.y;
          this.isServed = true;
          this.statusText.setText("Coffee served.");

          this.time.delayedCall(800, () => {
            this.scene.start("Customer", {
              customerIndex: this.customerIndex,
              served: true
            });
          });
        }
      }
    });

    this.makeButton = this.add.rectangle(centerX, height * 0.85, 280, 100, 0x8b668b);
    this.makeButton.setInteractive({ useHandCursor: true });

    this.buttonText = this.add.text(centerX, height * 0.85, "Make Coffee", {
      fontSize: "30px",
      color: "#000000"
    }).setOrigin(0.5);

    this.makeButton.on("pointerdown", () => {
      if (!this.isCoffeeReady) {
        this.makeCoffee();
      }
    });

    this.makeButton.on("pointerover", () => {
      this.makeButton.setFillStyle(0xa57aa5);
    });

    this.makeButton.on("pointerout", () => {
      this.makeButton.setFillStyle(0x8b668b);
    });
  }

  makeCoffee() {
    this.statusText.setText("Making coffee...");

    this.time.delayedCall(800, () => {
      this.isCoffeeReady = true;
      this.coffee.setVisible(true);
      this.statusText.setText("Drag the coffee to the tray.");
      this.buttonText.setText("Coffee Ready");
    });
  }
}