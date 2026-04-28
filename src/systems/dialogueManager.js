export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueBox = null;
    this.dialogueText = null;
    this.choiceButtons = [];
  }

  startDialogue(dialogues, onComplete) {
    this.dialogues = dialogues;
    this.index = 0;
    this.onComplete = onComplete;

    this.createUI();
    this.showNext();
  }

  createUI() {
    const { width, height } = this.scene.scale;

    this.dialogueBox = this.scene.add.rectangle(
      width / 2,
      height - 120,
      width * 0.8,
      140,
      0x000000,
      0.8
    ).setDepth(500);

    this.dialogueText = this.scene.add.text(
      width / 2,
      height - 140,
      "",
      {
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: width * 0.7 }
      }
    )
    .setOrigin(0.5)
    .setDepth(501);
  }

  showNext() {
    const current = this.dialogues[this.index];

    if (!current) {
      this.destroy();
      if (this.onComplete) this.onComplete();
      return;
    }

    this.dialogueText.setText(current.text);

    this.clearChoices();

    if (current.choices) {
      this.showChoices(current.choices);
    } else {
      this.scene.input.once("pointerdown", () => {
        this.index++;
        this.showNext();
      });
    }
  }

  showChoices(choices) {
    const { width, height } = this.scene.scale;

    choices.forEach((choice, i) => {
      const btn = this.scene.add.text(
        width / 2,
        height - 60 + i * 40,
        choice.text,
        {
          fontSize: "18px",
          backgroundColor: "#333",
          padding: { x: 10, y: 5 }
        }
      )
      .setOrigin(0.5)
      .setInteractive();

      btn.on("pointerdown", () => {
        if (choice.onChoose) choice.onChoose();

        if (choice.nextText) {
          this.dialogues.splice(this.index + 1, 0, {
            text: choice.nextText
          });
        }

        this.index++;
        this.showNext();
      });

      btn.setDepth(501);
      this.choiceButtons.push(btn);
    });
  }

  clearChoices() {
    this.choiceButtons.forEach(btn => btn.destroy());
    this.choiceButtons = [];
  }

  destroy() {
    this.clearChoices();

    if (this.dialogueBox) this.dialogueBox.destroy();
    if (this.dialogueText) this.dialogueText.destroy();
  }
}