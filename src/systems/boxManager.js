export default class BoxManager {
  constructor(scene) {
    this.scene = scene;
  }

  startBox(boxData) {
    this.boxData = boxData;

    this.scene.currentFish = 0;
    this.scene.cutResults = [];

    this.scene.dialogueManager.startDialogue(
      boxData.introDialogue,
      () => {
        this.enableCoworkerClick();
      }
    );
  }

  enableCoworkerClick() {
    this.scene.coworker.setInteractive();

    this.scene.coworker.once("pointerdown", () => {
      this.scene.dialogueManager.startDialogue(
        this.boxData.fishDialogue,
        () => {
          this.scene.startCuttingPhase();
        }
      );
    });
  }
}