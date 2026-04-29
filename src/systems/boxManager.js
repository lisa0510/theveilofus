export default class BoxManager {
  constructor(scene) {
    this.scene = scene;
  }

  startBox(boxId, boxData) {
    this.scene.currentBoxId = boxId;
    this.scene.currentBox = boxData;

    this.scene.currentFish = 0;
    this.scene.cutResults = [];

    this.scene.dialogueManager.startDialogue(
      boxData.introDialogue,
      () => {
        this.scene.enableCoworkerInteraction();
      }
    );
  }
}