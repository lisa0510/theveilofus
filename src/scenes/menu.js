import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("background", "assets/Fish02/UI/Fisch_Menü_UI.png");
    this.load.image("eye", "assets/Fish02/UI/FischAuge_Menü_UI.png");
    this.load.image("headphones", "assets/Fish02/UI/Kopfhörer_Symbol_UI.png");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(width / 2, height / 2, "background");
    bg.setDisplaySize(width, height);

    this.eyeCenterX = width / 2;
    this.eyeCenterY = height * 0.35;
    this.eye = this.add.image(this.eyeCenterX, this.eyeCenterY, "eye");
    this.eye.setScale(width < 1200 ? 0.28 : 0.4);
    this.maxEyeDistance = width < 1200 ? 28 : 40;

    const menuX = width < 1200 ? width * 0.16 : width * 0.12;
    const titleY = height < 750 ? height * 0.14 : height * 0.1;
    const startY = height * 0.5;
    const creditsY = height * 0.62;

    const titleFontSize = Math.max(70, width * 0.09);
    const buttonFontSize = Math.max(28, width * 0.035);
    const buttonPaddingX = Math.max(12, width * 0.012);
    const buttonPaddingY = Math.max(8, height * 0.01);

    this.add.text(menuX, titleY, "RIBA", {
      fontSize: `${titleFontSize}px`,
      fill: "#fff",
      fontFamily: "Helvetica"
    }).setOrigin(0.5);

    const startButton = this.add.text(menuX, startY, "START", {
      fontSize: `${buttonFontSize}px`,
      fill: "#ffffff",
      fontFamily: "Helvetica",
      backgroundColor: "#000000aa",
      padding: {
        x: buttonPaddingX,
        y: buttonPaddingY
      }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#ff0" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#fff" });
    });

    startButton.on("pointerdown", () => {
      this.scene.start("Intro");
    });

    const creditsButton = this.add.text(menuX, creditsY, "Credits", {
      fontSize: `${buttonFontSize}px`,
      fill: "#ffffff",
      fontFamily: "Helvetica",
      backgroundColor: "#000000aa",
      padding: {
        x: buttonPaddingX,
        y: buttonPaddingY
      }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    creditsButton.on("pointerover", () => {
      creditsButton.setStyle({ fill: "#ff0" });
    });

    creditsButton.on("pointerout", () => {
      creditsButton.setStyle({ fill: "#fff" });
    });

    this.createPopup();
  }

  createPopup() {
    const { width, height } = this.scale;

    this.popupOverlay = this.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      1
    )
      .setOrigin(0)
      .setInteractive()
      .setDepth(100);

    this.popupContainer = this.add.container(width / 2, 0).setDepth(101);

    const topPadding = height * 0.2;
    const spacing = height * 0.2;

    const headerText = this.add.text(
      0,
      topPadding,
      ' "Wenn das Wasser steigt, muss man versuchen darin zu überleben." ',
      {
        fontSize: `${Math.max(20, height * 0.04)}px`,
        fill: "#ffffff",
        fontFamily: "Helvetica",
        fontStyle: "italic",
        align: "center",
        wordWrap: { width: width * 0.8 }
      }
    ).setOrigin(0.5);

    const popupImg = this.add.image(0, height / 2, "headphones")
      .setScale(width < 1200 ? 0.14 : 0.2);

    const infoText = this.add.text(
      0,
      popupImg.y + spacing,
      "Trage Kopfhörer für eine bessere Erfahrung.",
      {
        fontSize: `${Math.max(18, height * 0.03)}px`,
        fill: "#bbbbbb",
        align: "center",
        fontFamily: "Helvetica"
      }
    ).setOrigin(0.5);

    const hintText = this.add.text(
      0,
      height * 0.9,
      "[ Press any key or click to start ]",
      {
        fontSize: `${Math.max(16, height * 0.025)}px`,
        fill: "#666666",
        fontFamily: "Helvetica"
      }
    )
      .setOrigin(0.5)
      .setName("waveText");

    this.popupContainer.add([
      headerText,
      popupImg,
      infoText,
      hintText
    ]);

    const closePopup = () => {
      if (this.popupContainer) this.popupContainer.destroy();
      if (this.popupOverlay) this.popupOverlay.destroy();

      this.input.keyboard.off("keydown");
      this.input.off("pointerdown");
    };

    this.time.delayedCall(200, () => {
      this.input.keyboard.on("keydown", closePopup);
      this.input.on("pointerdown", closePopup);
    });
  }

  update(time) {
    if (this.popupContainer && this.popupContainer.active) {
      this.popupContainer.iterate((child) => {
        if (child.name === "waveText") {
          child.y += Math.sin(time * 0.002) * 0.25;
          child.angle = Math.sin(time * 0.001) * 0.5;
        }
      });
    }

    if (this.popupOverlay && this.popupOverlay.active) return;

    const pointer = this.input.activePointer;

    const angle = Phaser.Math.Angle.Between(
      this.eyeCenterX,
      this.eyeCenterY,
      pointer.x,
      pointer.y
    );

    const dist = Phaser.Math.Distance.Between(
      this.eyeCenterX,
      this.eyeCenterY,
      pointer.x,
      pointer.y
    );

    const sensitivity = 2;
    const constrainedDist = Math.min(
      dist * sensitivity,
      this.maxEyeDistance
    );

    this.eye.x =
      this.eyeCenterX + Math.cos(angle) * constrainedDist;

    this.eye.y =
      this.eyeCenterY + Math.sin(angle) * constrainedDist;
  }
}