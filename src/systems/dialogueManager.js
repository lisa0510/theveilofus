export default class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueBox = null;
    this.dialogueText = null;
    this.continueBtn = null;
  }

  startDialogue(dialogues, onComplete = null) {
    this.clearDialogue();

    this.dialogues = dialogues;
    this.currentIndex = 0;
    this.onComplete = onComplete;

    const { width, height } = this.scene.scale;

    this.dialogueBox = this.scene.add.rectangle(
      width / 2,
      height / 1.3,
      width * 0.7,
      140,
      0x000000,
      0.8
    ).setDepth(500);

    this.dialogueText = this.scene.add.text(
      width / 2,
      height / 1.3,
      "",
      {
        fontSize: "22px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: width * 0.6 }
      }
    )
      .setOrigin(0.5)
      .setDepth(501);

    this.continueBtn = this.scene.add.text(
      width / 1.25,
      height / 1.3,
      "...",
      {
        fontSize: "20px",
        backgroundColor: "#333",
        color: "#fff",
        padding: { x: 20, y: 10 }
      }
    )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(502);

    this.continueBtn.on("pointerdown", () => {
      this.nextDialogue();
    });

    this.nextDialogue();
  }

  nextDialogue() {
    if (this.currentIndex < this.dialogues.length) {
      this.dialogueText.setText(
        this.dialogues[this.currentIndex].text
      );

      this.currentIndex++;
    } else {
      this.clearDialogue();

      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  clearDialogue() {
    if (this.dialogueBox) this.dialogueBox.destroy();
    if (this.dialogueText) this.dialogueText.destroy();
    if (this.continueBtn) this.continueBtn.destroy();

    this.dialogueBox = null;
    this.dialogueText = null;
    this.continueBtn = null;
  }
}