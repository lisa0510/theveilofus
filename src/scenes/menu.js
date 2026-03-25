import Phaser from "phaser";
import datacustomers from "../datacustomers.js";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { centerX, centerY } = this.cameras.main;

    this.cameras.main.setBackgroundColor("#f5e6c8");

    this.add.text(centerX, centerY - 180, "The Veil of Us", {
      fontSize: "52px",
      color: "#2b1f1f"
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.rectangle(centerX, centerY, 260, 100, 0xffffff);
    startButton.setInteractive({ useHandCursor: true });

    this.add.text(centerX, centerY, "Start Game", {
      fontSize: "30px",
      color: "#000"
    }).setOrigin(0.5);

    startButton.on("pointerdown", () => {
      this.scene.start("Customer", { customer: datacustomers[0] });
    });

    startButton.on("pointerover", () => {
      startButton.setFillStyle(0xdddddd);
    });

    startButton.on("pointerout", () => {
      startButton.setFillStyle(0xffffff);
    });

    // Settings button
    const settingsY = centerY + 130;

    const settingsButton = this.add.rectangle(centerX, settingsY, 260, 100, 0x8b668b);
    settingsButton.setInteractive({ useHandCursor: true });

    this.add.text(centerX, settingsY, "Settings", {
      fontSize: "28px",
      color: "#000"
    }).setOrigin(0.5);

    settingsButton.on("pointerdown", () => {
      console.log("Settings clicked");
    });

    settingsButton.on("pointerover", () => {
      settingsButton.setFillStyle(0xa57aa5);
    });

    settingsButton.on("pointerout", () => {
      settingsButton.setFillStyle(0x8b668b);
    });
  }
}