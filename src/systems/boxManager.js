export default class BoxManager {
  constructor(scene) {
    this.scene = scene;
  }

  startBox(boxData) {
    this.scene.currentBox = boxData;

    this.scene.dialogueManager.startDialogue(
      boxData.introDialogue,
      () => {
        this.scene.enableCoworkerInteraction();
      }
    );
  }
}