import Phaser from "phaser";

export default class Customer extends Phaser.Scene {
  constructor() {
    super("Customer");
  }

  init(data) {
    this.customerData = data.customer;
    this.served = data.served || false;
    this.reaction = data.reaction || null;
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

    const bg = this.add.image(centerX, centerY, "shop");
    bg.setDisplaySize(width, height);

    const customer = this.add.image(
      centerX,
      centerY - height * 0.08,
      this.customerData.image
    );
    customer.setScale(0.3);

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

    let dialogueText = this.customerData.dialogue;
    let orderText = `Order: ${this.customerData.order}`;

    if (this.served) {
      dialogueText = this.reaction;
      orderText = "";
    }

    this.add.text(centerX, dialogueBoxY - 35, this.customerData.name, {
      fontSize: "28px",
      color: "#000000",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(centerX, dialogueBoxY, dialogueText, {
      fontSize: "24px",
      color: "#222222",
      align: "center",
      wordWrap: { width: width * 0.42 }
    }).setOrigin(0.5);

    if (orderText !== "") {
      this.add.text(centerX, dialogueBoxY + 40, orderText, {
        fontSize: "22px",
        color: "#5a3e36"
      }).setOrigin(0.5);
    }

    const buttonLabel = this.served ? "Continue" : "CoffeeBar";

    const button = this.add.rectangle(width * 0.85, height * 0.85, 200, 100, 0xffffff);
    button.setInteractive({ useHandCursor: true });

    this.add.text(width * 0.85, height * 0.85, buttonLabel, {
      fontSize: "30px",
      color: "#000"
    }).setOrigin(0.5);

    button.on("pointerdown", () => {
      if (this.served) {
        // later: go to machine dialogue / next scene
        console.log("Go to next scene");
      } else {
        this.scene.start("CoffeeBar", {
          customer: this.customerData,
          order: this.customerData.order
        });
      }
    });
  }
}