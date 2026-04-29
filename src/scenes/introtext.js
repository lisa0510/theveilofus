import Phaser from "phaser";

export default class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  create() {
    const { width, height } = this.scale;

    const isSmallScreen = width < 1200 || height < 750;

    const headerSize = isSmallScreen ? "18px" : "25px";
    const bodySize = isSmallScreen ? "16px" : "25px";
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
        fontFamily: "Courier New",
        wordWrap: { width: width * 0.9 }
      }
    ).setOrigin(0.5);

    const introText = `Irgendwann in der Zukunft werden der Grossteil der Erdbevölkerung sowie weite Teile des Landes von Wasser überflutet sein.

Der Menschheit bleibt keine andere Wahl, als unter den Wellen und auf provisorischen Inseln Zuflucht zu suchen.

Du bist Doktor der Meeresbiologie und arbeitest in einer Unterwasser-Forschungsstation in der Adria.

Der Zweck der Station ist die kontinuierliche Untersuchung der dort lebenden Meeresarten, von denen sich die meisten glücklicherweise bereits vor Jahrzehnten an ihre toxische Umwelt angepasst haben.

Deine Aufgabe besteht in der Vorbereitung dieser Proben gemeinsam mit deinem Assistenten für die Forschung.

Du gehörst zu weniger als hundert Menschen, die direkt mit diesen Tieren arbeiten dürfen – stets mit äusserster Vorsicht.

Doch selbst mit der richtigen Ausrüstung gab es kein Entkommen vor der Kontamination, die diese armen Kreaturen erdulden mussten.`;

    const mainText = this.add.text(
      width / 2,
      textY,
      "",
      {
        fontSize: bodySize,
        color: "#b7ffd8",
        align: "left",
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