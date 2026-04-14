import Phaser from "phaser";
import datacustomers from "../datacustomers.js";

export default class day1_coffebar extends Phaser.Scene {
  constructor() {
    super("day1_coffebar");
  }

  preload() {
    //assets
    this.load.image("counter", "/assets/blockout/serviceView/Counter_ServiceView_Blockout01.png"); 
    this.load.image("kasse", "/assets/blockout/serviceView/Cash_ServiceView_Blockout01.png"); 
    this.load.image("radio", "/assets/blockout/serviceView/Radio_ServiceView_Blockout01.png"); 
    this.load.image("unc", "/assets/blockout/serviceView/Uncle_ServiceView_Blockout01.png"); 

    //audio
    this.load.audio("radioSound", "/assets/audio/radio.mp3");

    //customers
    this.load.image("karl", "/assets/blockout/serviceView/Costumer_ServiceView_Blockout01.png");
    this.load.image("lukarde", "/assets/customer/lukarde.jpg");
    this.load.image("laura", "/assets/customer/laura.jpg");
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, "counter").setScale(0.3);
    this.add.image(width / 2.8, height / 1.8, "kasse").setScale(0.17);
    const radioImg = this.add.image(width / 1, height / 2, "radio")
      .setScale(0.25)
      .setInteractive({ cursor: 'pointer' });

    const radioSound = this.sound.add("radioSound", { volume: 0.5 });

    const uncImg = this.add.image(width * 0.5, height / 3, "unc")
      .setScale(0.2);

    const box = this.add.rectangle(width / 2, height * 0.9, width * 0.5, 120, 0xf8f1e7, 0.5)
      .setStrokeStyle(1, 0xffffff);

    const dialogueText = this.add.text(width / 2, height * 0.9,
      "Schalte das Radio ein, Klara. Es ist Zeit, den Laden zu öffnen!",
      {
        fontSize: "25px",
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: width * 0.25 }
      }
    ).setOrigin(0.5);

    const customer = datacustomers[0];

    radioImg.on('pointerdown', () => {
      if (!radioSound.isPlaying) {
        radioSound.play();
        uncImg.setVisible(false);
        dialogueText.setVisible(false);
        box.setVisible(false);
        this.time.delayedCall(1000, () => {
          this.startCustomerDialogue(customer);
        });

      } else {
        radioSound.stop();
      }
    });
  }

  startCustomerDialogue(customer) {
    const { width, height } = this.scale;
    const customerImg = this.add.image(width / 2, height / 2, customer.image)
      .setScale(0.2);
    const box = this.add.rectangle(width / 2, height * 0.9, width * 0.5, 120, 0xf8f1e7,0.5)
      .setStrokeStyle(1, 0xffffff);

    const nameText = this.add.text(width / 2, height * 0.85, 
      customer.name, 
      {
        fontSize: "22px",
        color: "#000000",
        fontFamily: "cursive",
        fontWeight: "bold"
      }
    ).setOrigin(0.5);

    const dialogueText = this.add.text(width / 2, height * 0.9,
      customer.dialogue,
      {
        fontSize: "20px",
        color: "#000",
        align: "center",
        fontFamily: "cursive",
        wordWrap: { width: width * 0.55 }
      }
    ).setOrigin(0.5);

   

    const choiceButtons = [];

    customer.choices.forEach((choice, index) => {
      const y = height * 0.7 + index * 70;

      const btn = this.add.rectangle(width * 0.5, y, width * 0.5, 50, 0xffffff)
        .setStrokeStyle(2, 0x000000)
        .setInteractive({ useHandCursor: true });

      const txt = this.add.text(width * 0.5, y, choice.text, {
        fontSize: "20px",
        color: "#000",
        align: "center",
        wordWrap: { width: width * 0.45 }
      }).setOrigin(0.5);

      btn.on("pointerover", () => btn.setFillStyle(0xeadfd1));
      btn.on("pointerout", () => btn.setFillStyle(0xffffff));

      btn.on("pointerdown", () => {
        // remove buttons
        choiceButtons.forEach(obj => obj.destroy());

        // show reply
        dialogueText.setText(choice.customerReply);

        // after delay → show order
        this.time.delayedCall(1500, () => {
          dialogueText.setText("Order: " + customer.order);

          // 👉 NEXT STEP HOOK (you can trigger coffee gameplay here)
          // this.startCoffeeMiniGame(customer);
        });
      });

      choiceButtons.push(btn, txt);
    });
  }
}