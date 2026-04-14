import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("introBg", "/assets/blockout/baristaStation/MirrorView_BaristaStation_Blockout01.png");
    this.load.image("apronUp", "/assets/blockout/baristaStation/ApronON_BaristaStation_Blockout01.png");
    this.load.image("apronOff", "/assets/blockout/baristaStation/ApronOFF_BaristaStation_Blockout01.png");
    this.load.image("apron", "/assets/blockout/baristaStation/Apron_BaristaStation_Blockout01.png");
    this.load.audio("unc", "/assets/audio/unc_marin.mp3");
  }

  create() {
    const { width, height } = this.scale;

    this.bg = this.add.image(width * 1.2, height * 0.5, "introBg");
    this.bg.setDisplaySize(width * 1.1, height * 1.1);
    //Hier wird der Skalierungsfaktor ein Ergebnis der Bildschirmbreite.Laptop ($1400px$ Breite): $1400 \times 0.00006 = \mathbf{0.084}$ (Klara wird kleiner skaliert).Monitor ($2560px$ Breite): $2560 \times 0.00006 = \mathbf{0.153}$ (Klara wird größer skaliert).
    this.klaraApronOff = this.add.image(width * 1.05, height * 0.25, "apronOff");
    this.klaraApronOff.setScale(width * 0.00006); 

    this.apron = this.add.image(width * 0.9, height * 0.6, "apron");
    this.apron.setScale(width * 0.0001);
    this.apron.setInteractive();

    const uiX = width * 0.2; // 20% von links für UI-Elemente
    this.title = this.add.text(uiX, height * 0.3, "The Veil of Us", {
      fontSize: `${Math.floor(width * 0.04)}px`, // Schriftgröße skaliert mit
      color: "#f5efe6",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.startButton = this.add.rectangle(uiX, height * 0.5, width * 0.18, height * 0.08, 0xffffff, 0.95);
    this.startButton.setStrokeStyle(2, 0x3b2a24).setInteractive({ useHandCursor: true });

    this.startText = this.add.text(uiX, height * 0.5, "Start Game", {
      fontSize: `${Math.floor(width * 0.018)}px`,
      color: "#000000",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.settingsButton = this.add.rectangle(uiX, height * 0.65, width * 0.18, height * 0.08, 0xffffff, 0.95);
    this.settingsButton.setStrokeStyle(2, 0x3b2a24).setInteractive({ useHandCursor: true });

    this.settingsText = this.add.text(uiX, height * 0.65, "Settings", {
      fontSize: `${Math.floor(width * 0.018)}px`,
      color: "#000000",
      fontFamily: "cursive",
    }).setOrigin(0.5);

    this.startButton.on("pointerdown", () => {
      this.playIntroReveal();
      this.time.delayedCall(2000, () => {
        if (this.cache.audio.exists("unc")) this.sound.play("unc");
      });
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }

  //check if apron is close enough to klara
  update() {
    if (this.apron && this.klaraApronOff && this.dialogBox) {
      const distance = Phaser.Math.Distance.Between(this.apron.x, this.apron.y, this.klaraApronOff.x, this.klaraApronOff.y);
      const threshold = this.scale.width * 0.1; // 10% der Breite als Fangbereich

      if (distance < threshold && this.klaraApronOff.texture.key !== "apronUp") {
        this.wearApron();
      }
    }
  }

  playIntroReveal() {
    const { width } = this.scale;
    this.startButton.disableInteractive();
    this.settingsButton.disableInteractive();

    // UI ausblenden
    this.tweens.add({
      targets: [this.startButton, this.startText, this.title, this.settingsButton, this.settingsText],
      alpha: 0,
      duration: 1000
    });

    // Bewegung: Schiebe alles um 70% der Bildschirmbreite nach links
    this.tweens.add({
      targets: [this.bg, this.klaraApronOff, this.apron],
      x: `-=${width * 0.7}`, 
      duration: 3000,
      ease: "Sine.easeInOut",
      onComplete: () => this.showApronDialogue()
    });
  }

  showApronDialogue() {
    const { width, height } = this.scale;
    const boxWidth = width * 0.55;
    
    this.dialogBox = this.add.rectangle(width * 0.5, height * 0.82, boxWidth, height * 0.12, 0xf8f1e7, 0.96);
    this.dialogBox.setStrokeStyle(2, 0x3b2a24);

    this.dialogText = this.add.text(width * 0.5, height * 0.82, 
      "Zieh dir die Schürze an...", 
      {
        fontSize: `${Math.floor(width * 0.02)}px`,
        color: "#2b1f1f",
        fontFamily: "cursive",
        align: "center",
        wordWrap: { width: boxWidth - 40 }
      }
    ).setOrigin(0.5);

    this.tweens.add({ targets: [this.dialogBox, this.dialogText], alpha: { from: 0, to: 1 }, duration: 500 });
    this.input.setDraggable(this.apron);
  }

  wearApron() {
    this.klaraApronOff.setTexture("apronUp");
    this.apron.setVisible(false).disableInteractive();
    this.tweens.add({ targets: this.klaraApronOff, scale: this.klaraApronOff.scale * 1.1, duration: 100, yoyo: true });
    if (this.dialogBox) this.tweens.add({ targets: [this.dialogBox, this.dialogText], alpha: 0, duration: 500 });
    this.time.delayedCall(1500, () => this.scene.start("Tutorial"));
  }
}