class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.boxResults = {
      box1: [],
      box2: [],
      box3: []
    };

    this.fishChoices = {
      box1: [],
      box2: [],
      box3: []
    };

    this.parasiteChoices = {
      box1: [],
      box2: [],
      box3: []
    };

    this.parasiteInteractions = {
      box1: false,
      box2: false,
      box3: false
    };
  }

  // Cuts speichern
  saveCut(box, percent) {
    this.boxResults[box].push(percent);
  }

  // Fish choices
  saveFishChoice(box, choiceId) {
    this.fishChoices[box].push(choiceId);
  }

  // Parasite choices
  saveParasiteChoice(box, choiceId) {
    this.parasiteChoices[box].push(choiceId);
  }

  // Parasite encounter
  setParasiteInteraction(box, interacted) {
    this.parasiteInteractions[box] = interacted;
  }

  // Check perfekt
  isPerfectBox(box) {
    const results = this.boxResults[box];

    if (!results.length) return false;

    return results.every((cut) => cut === 50);
  }

  // Durchschnitt Box
  getBoxAverage(box) {
    const results = this.boxResults[box];

    if (!results.length) return 0;

    return results.reduce((a, b) => a + b, 0) / results.length;
  }

  // Gesamtdurchschnitt
  getOverallAverage() {
    const allCuts = [
      ...this.boxResults.box1,
      ...this.boxResults.box2,
      ...this.boxResults.box3
    ];

    if (!allCuts.length) return 0;

    return allCuts.reduce((a, b) => a + b, 0) / allCuts.length;
  }

  // Ending Logik
  getEnding() {
    const perfectBoxes =
      (this.isPerfectBox("box1") ? 1 : 0) +
      (this.isPerfectBox("box2") ? 1 : 0) +
      (this.isPerfectBox("box3") ? 1 : 0);

    const parasiteCount = Object.values(this.parasiteInteractions)
      .filter(Boolean).length;

    if (perfectBoxes === 3 && parasiteCount === 0) {
      return "perfectEnding";
    }

    if (perfectBoxes >= 2 && parasiteCount <= 1) {
      return "goodEnding";
    }

    if (parasiteCount >= 2) {
      return "parasiteEnding";
    }

    return "badEnding";
  }
}

const gameState = new GameState();

export default gameState;