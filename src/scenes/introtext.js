import Phaser from "phaser";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  create() {
    const { width, height } = this.scale;

    const isSmallScreen = width < 1200 || height < 750;

    const headerSize = isSmallScreen ? "17px" : "24px";
    const bodySize = isSmallScreen ? "15px" : "22px";
    const hintSize = isSmallScreen ? "14px" : "18px";

    const panelW = width * 0.8;
    const panelH = height * 0.7;
    const panelX = width / 2;
    const panelY = height * 0.5;

    this.add.rectangle(width / 2, height / 2, width, height, 0x111816);


    // inner monitor
    this.add.rectangle(panelX, panelY, panelW * 0.9, panelH * 0.75, 0x07130e, 0.95)
      .setStrokeStyle(2, 0x3cff9b, 0.7);

    // top bar
    this.add.rectangle(panelX, panelY - panelH * 0.42, panelW * 0.9, 8, 0x3cff9b, 0.85);

    this.add.text(
      panelX,
      panelY - panelH * 0.52,
      "UNTERWASSER-FORSCHUNGSSTATION ADRIA-03 // SYSTEMPROTOKOLL",
      {
        fontSize: headerSize,
        color: "#3cff9b",
        fontFamily: "Courier New",
        align: "center",
        wordWrap: { width: panelW * 0.9 }
      }
    ).setOrigin(0.5);

    // small status text
    this.add.text(
      width * 0.14,
      height * 0.08,
      "DEPTH: -420M\nO2: STABIL\nCOM: LOW SIGNAL",
      {
        fontSize: isSmallScreen ? "12px" : "15px",
        color: "#70ffad",
        fontFamily: "Courier New",
        lineSpacing: 6
      }
    );

    this.add.text(
      width * 0.78,
      height * 0.08,
      "CREW ID: M.SCHWARZ\nSTATION: ADRIA-03\nDATE: 30.12.2126",
      {
        fontSize: isSmallScreen ? "12px" : "15px",
        color: "#70ffad",
        fontFamily: "Courier New",
        lineSpacing: 6
      }
    );

    for (let y = 0; y < height; y += 8) {
      this.add.rectangle(width / 2, y, width, 1, 0x3cff9b, 0.035);
    }

    const introText = `Als die Sonne anfing, die Erdoberfläche zu verbrennen, befanden wir uns auf unserer Arbeitsstation in der Adria.

Die Versäuerung der Ozeane war ein Nebeneffekt, der unser Überleben erschwerte. Die Organismen passten sich an ihr neues Umfeld an – doch für uns wurde Nahrung knapp.

Wir mussten lernen, das Fischfleisch von den Kiemen und jenen Stellen zu trennen, die sich für Menschen als giftig erwiesen hatten.

Mein Name ist Mona Schwarz. Ich bin eines der Crew-Mitglieder dieser Station und habe mich dazu entschlossen, die Zubereitung der Proben zu übernehmen.
Jedoch weiss ich nicht wie lange meine Psyche diese Lebenssituation noch aushalten wird.`;

    const mainText = this.add.text(
      panelX,
      panelY,
      "",
      {
        fontSize: bodySize,
        color: "#b7ffd8",
        fontFamily: "Courier New",
        align: "left",
        wordWrap: { width: panelW * 0.78 },
        lineSpacing: isSmallScreen ? 6 : 10
      }
    ).setOrigin(0.5);

    let index = 0;
    let isFinished = false;

    const typeEvent = this.time.addEvent({
      delay: isSmallScreen ? 8 : 18,
      loop: true,
      callback: () => {
        mainText.setText(introText.slice(0, index));
        index++;

        if (index > introText.length) {
          typeEvent.remove(false);
          isFinished = true;
          hintText.setText("[ PRESS ANY KEY OR CLICK TO START ]");
        }
      }
    });

    const hintText = this.add.text(
      width / 2,
      height * 0.91,
      "[ PRESS ANY KEY OR CLICK TO SKIP ]",
      {
        fontSize: hintSize,
        color: "#3cff9b",
        fontFamily: "Courier New",
        align: "center"
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: hintText,
      alpha: 0.35,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.InOut"
    });

    const goNext = () => {
      if (!isFinished) {
        typeEvent.remove(false);
        mainText.setText(introText);
        hintText.setText("[ PRESS ANY KEY OR CLICK TO START ]");
        isFinished = true;
        return;
      }

      this.scene.start("Tutorial");
    };

    this.input.keyboard.on("keydown", goNext);
    this.input.on("pointerdown", goNext);
  }
}