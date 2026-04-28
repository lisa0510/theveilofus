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

    this.whaleChoices = {
      box1: [],
      box2: [],
      box3: []
    };

    this.whaleInteractions = {
      box1: false,
      box2: false,
      box3: false
    };
  }

  // Fisch-Schnitte speichern
  saveCut(box, percent) {
    this.boxResults[box].push(percent);
  }

  // Fisch Dialog Choices speichern
  saveFishChoice(box, choice) {
    this.fishChoices[box].push(choice);
  }

  // Whale Dialog Choices speichern
  saveWhaleChoice(box, choice) {
    this.whaleChoices[box].push(choice);
  }

  // Whale Encounter speichern
  setWhaleInteraction(box, interacted) {
    this.whaleInteractions[box] = interacted;
  }

  // Prüfen ob komplette Box perfekt war
  isPerfectBox(box) {
    return this.boxResults[box].every(cut => cut === 50);
  }

  // Durchschnitt der Box
  getBoxAverage(box) {
    const results = this.boxResults[box];

    if (!results.length) return 0;

    return (
      results.reduce((a, b) => a + b, 0) /
      results.length
    );
  }

  // Gesamtdurchschnitt
  getOverallAverage() {
    const allCuts = [
      ...this.boxResults.box1,
      ...this.boxResults.box2,
      ...this.boxResults.box3
    ];

    if (!allCuts.length) return 0;

    return (
      allCuts.reduce((a, b) => a + b, 0) /
      allCuts.length
    );
  }

  // Ending bestimmen
  getEnding() {
    const perfectBoxes =
      (this.isPerfectBox("box1") ? 1 : 0) +
      (this.isPerfectBox("box2") ? 1 : 0) +
      (this.isPerfectBox("box3") ? 1 : 0);

    const whaleCount =
      Object.values(this.whaleInteractions)
        .filter(Boolean).length;

    if (perfectBoxes === 3 && whaleCount === 0) {
      return "perfectEnding";
    }

    if (perfectBoxes >= 2 && whaleCount <= 1) {
      return "goodEnding";
    }

    if (whaleCount >= 2) {
      return "whaleEnding";
    }

    return "badEnding";
  }
}

const gameState = new GameState();

export default gameState;