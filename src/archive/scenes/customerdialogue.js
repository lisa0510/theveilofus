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
    this.playerChoice = null;
  }

  preload() {
    this.load.image("shop", "/assets/customer/shop.jpg");
    this.load.image("elizabeth", "/assets/customer/elizabeth.jpg");
    this.load.image("lukarde", "/assets/customer/lukarde.jpg");
    this.load.image("laura", "/assets/customer/laura.jpg");
    this.load.image("klara", "/assets/customer/klara.jpg");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    const width = this.scale.width;
    const height = this.scale.height;

    const bg = this.add.image(centerX, centerY, "shop");
    bg.setDisplaySize(width, height);

    const customerImage = this.add.image(
      centerX,
      centerY - height * 0.1,
      this.customerData.image
    );
    customerImage.setScale(0.3);

    //dialogue box preparation
    const boxY = centerY + height * 0.2;
    const boxWidth = width * 0.6;
    const boxHeight = height * 0.22;
    const box = this.add.rectangle(
      centerX,
      boxY,
      boxWidth,
      boxHeight,
      0xf8f1e7,
      0.96
    );
    box.setStrokeStyle(3, 0x000000);

    this.add.text(centerX, boxY - boxHeight * 0.35, this.customerData.name, {
      fontSize: "28px",
      color: "#3b2a24",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.dialogueText = this.add.text(centerX, boxY - 10, "", {
      fontSize: "22px",
      color: "#222222",
      align: "center",
      wordWrap: { width: boxWidth - 60 }
    }).setOrigin(0.5);

    this.orderText = this.add.text(centerX, boxY + boxHeight * 0.32, "", {
      fontSize: "20px",
      color: "#6b4d3a"
    }).setOrigin(0.5);

    if (this.served) {
      this.showServedReaction(width, height);
    } else {
      this.showInitialDialogue(width, height);
    }
  }

  showInitialDialogue(width, height) {
    this.dialogueText.setText(this.customerData.dialogue);
    this.orderText.setText(`Order: ${this.customerData.order}`);

    this.choiceButtons = [];

    if (this.customerData.choices && this.customerData.choices.length > 0) {
      const startY = height * 0.85;
      const gap = 80;

      this.customerData.choices.forEach((choice, index) => {
        const buttonY = startY + index * gap;

        const button = this.add.rectangle(
          width * 0.5,
          buttonY,
          width * 0.42,
          60,
          0xffffff,
          1
        );
        button.setStrokeStyle(2, 0x3b2a24);
        button.setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(
          width * 0.5,
          buttonY,
          choice.text,
          {
            fontSize: "20px",
            color: "#000000",
            align: "center",
            wordWrap: { width: width * 0.38 }
          }
        ).setOrigin(0.5);

        button.on("pointerover", () => {
          button.setFillStyle(0xeadfd1);
        });

        button.on("pointerout", () => {
          button.setFillStyle(0xffffff);
        });
        //die komplette gewählte Choice wird übergeben.
        button.on("pointerdown", () => {
          this.handleChoice(choice, width, height);
        });

        this.choiceButtons.push(button, buttonText);
      });
    }
  }

  handleChoice(choice, width, height) {
    this.playerChoice = choice;
    //auswahl buttons löschen
    if (this.choiceButtons) {
      this.choiceButtons.forEach((obj) => obj.destroy());
    }

    this.dialogueText.setText(choice.customerReply);
    this.orderText.setText(`Order: ${this.customerData.order}`);

    const continueButton = this.add.rectangle(
      width * 0.84,
      height * 0.88,
      250,
      100,
      0xffffff,
      1
    );
    continueButton.setStrokeStyle(2, 0x3b2a24);
    continueButton.setInteractive({ useHandCursor: true });

    const continueText = this.add.text(
      width * 0.84,
      height * 0.88,
      "CoffeeBar",
      {
        fontSize: "30px",
        color: "#000000"
      }
    ).setOrigin(0.5);

    continueButton.on("pointerover", () => {
      continueButton.setFillStyle(0xeadfd1);
    });

    continueButton.on("pointerout", () => {
      continueButton.setFillStyle(0xffffff);
    });

    continueButton.on("pointerdown", () => {
      this.scene.start("CoffeeBar", {
        customerIndex: this.customerIndex,
        playerChoice: choice.text
      });
    });
  }

  showServedReaction(width, height) {
    this.dialogueText.setText(this.customerData.reaction);
    this.orderText.setText("");

    const continueButton = this.add.rectangle(
      width * 0.84,
      height * 0.88,
      250,
      100,
      0xffffff,
      1
    );
    continueButton.setStrokeStyle(2, 0x3b2a24);
    continueButton.setInteractive({ useHandCursor: true });

    const continueText = this.add.text(
      width * 0.84,
      height * 0.88,
      "Continue",
      {
        fontSize: "30px",
        color: "#000000"
      }
    ).setOrigin(0.5);

    continueButton.on("pointerover", () => {
      continueButton.setFillStyle(0xeadfd1);
    });

    continueButton.on("pointerout", () => {
      continueButton.setFillStyle(0xffffff);
    });

    continueButton.on("pointerdown", () => {
      const nextIndex = this.customerIndex + 1;

      if (nextIndex < datacustomers.length) {
        this.scene.start("Customer", {
          customerIndex: nextIndex
        });
      } else {
        this.scene.start("Menu");
      }
    });
  }
}