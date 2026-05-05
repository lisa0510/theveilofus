import Phaser from "phaser";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  create() {
    const { width, height } = this.scale;

    const isSmallScreen = width < 1200 || height < 750;

    const headerSize = isSmallScreen ? "20px" : "25px";
    const bodySize = isSmallScreen ? "18px" : "25px";
    const hintSize = isSmallScreen ? "15px" : "20px";

    const textWrapWidth = isSmallScreen ? width * 0.86 : width * 0.68;
    const textY = isSmallScreen ? height * 0.52 : height * 0.5;
    const lineSpacing = isSmallScreen ? 6 : 9;

    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x03110c
    );

    this.add.text(
      width / 2,
      height * 0.08,
      "UNTERWASSER-FORSCHUNGSSTATION ADRIA // SYSTEMPROTOKOLL",
      {
        fontSize: headerSize,
        color: "#3cff9b",
        align: "center",
        fontSize: headerSize,
        fontFamily: "Courier New",
        wordWrap: { width: width * 0.9 }
      }
    ).setOrigin(0.5);

    const introText = `Als die Gewässer übersäuerten und die Erdoberfläche in der Hitze verglühte, suchte die Menschheit Zuflucht in der Tiefe. Doch das Überleben war schwierig, ausser Meerestiere gab es kaum Nahrung, und deren biochemische Anpassungen an die Umgebung machten sie für den Menschen giftig.

Du gehörst zu einer kleinen Gruppe von  Spezialisten, die sich mit der Aufbereitung dieser Organismen für den Verzehr beschäftigen. Deine Aufgabe ist es, mithilfe präziser Laserschnitte die giftigen von den essbaren Bestandteilen zu trennen.
Jeder Fehlschnitt bedeutet weniger Nahrung für die bereits hungernde Bevölkerung.`;

    const mainText = this.add.text(
      width / 2,
      textY,
      "",
      {
        fontSize: bodySize,
        color: "#b7ffd8",
        align: "center",
        fontFamily: "Courier New",
        wordWrap: { width: textWrapWidth },
        lineSpacing
      }
    ).setOrigin(0.5);

    let index = 0;
    let isFinished = false;

    const typeEvent = this.time.addEvent({
      delay: isSmallScreen ? 10 : 22,
      loop: true,
      callback: () => {
        mainText.setText(introText.slice(0, index));
        index++;

        if (index > introText.length) {
          typeEvent.remove(false);
          isFinished = true;
        }
      }
    });

    const hintText = this.add.text(
      width / 2,
      height * 0.92,
      isFinished
        ? "[ PRESS ANY KEY OR CLICK TO START ]"
        : "[ PRESS ANY KEY OR CLICK TO SKIP ]",
      {
        fontSize: hintSize,
        color: "#3cff9b",
        fontFamily: "Courier New",
        wordWrap: { width: width * 0.9 },
        align: "center"
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: hintText,
      alpha: 0.35,
      duration: 1600,
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