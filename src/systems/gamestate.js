class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.boxResults = {
      box1: [],
      box2: []
    };

    this.fishChoices = {
      box1: [],
      box2: []
    };

    this.parasiteChoices = {
      box1: [],
      box2: []
    };

    this.parasiteInteractions = {
      box1: false,
      box2: false
    };
  }

  saveCut(box, percent) {
    this.boxResults[box].push(percent);
  }

  saveFishChoice(box, choiceId) {
    this.fishChoices[box].push(choiceId);
  }

  saveParasiteChoice(box, choiceId) {
    this.parasiteChoices[box].push(choiceId);
  }

  setParasiteInteraction(box, interacted) {
    this.parasiteInteractions[box] = interacted;
  }

  isPerfectCut(cut) {
    return cut >= 45 && cut <= 55;
  }

  isPerfectBox(box) {
    const results = this.boxResults[box];

    if (!results.length) return false;

    return results.every((cut) => this.isPerfectCut(cut));
  }

  getAllCuts() {
    return [
      ...this.boxResults.box1,
      ...this.boxResults.box2
    ];
  }

  getRightCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const rightCuts = allCuts.filter((cut) =>
      this.isPerfectCut(cut)
    ).length;

    return (rightCuts / allCuts.length) * 100;
  }

  getWrongCutPercentage() {
    const allCuts = this.getAllCuts();

    if (!allCuts.length) return 0;

    const wrongCuts = allCuts.filter((cut) =>
      !this.isPerfectCut(cut)
    ).length;

    return (wrongCuts / allCuts.length) * 100;
  }

  getAllChoices() {
    return [
      ...this.fishChoices.box1,
      ...this.fishChoices.box2,
      ...this.parasiteChoices.box1,
      ...this.parasiteChoices.box2
    ];
  }

  getNegativeSelfTalkPercentage() {
    const allChoices = this.getAllChoices();

    if (!allChoices.length) return 0;

    const negativeChoices = [
      "remember_her",
      "she_exists",
      "dontcare",
      "wiedergutmachen",
      "pressure"
    ];

    const negativeCount = allChoices.filter((choiceId) =>
      negativeChoices.includes(choiceId)
    ).length;

    return (negativeCount / allChoices.length) * 100;
  }

  getEnding() {
    const rightPercent = this.getRightCutPercentage();
    const wrongPercent = this.getWrongCutPercentage();
    const negativePercent = this.getNegativeSelfTalkPercentage();

    if (wrongPercent > 51 && negativePercent > 31) {
      return "ending1";
    }

    if (wrongPercent > 51 && negativePercent <= 31) {
      return "ending2";
    }

    if (rightPercent > 51 && negativePercent > 31) {
      return "ending3";
    }

    if (rightPercent > 51 && negativePercent <= 31) {
      return "ending4";
    }

    return "endingNeutral";
  }

  getEndingStats() {
    return {
      rightPercent: this.getRightCutPercentage(),
      wrongPercent: this.getWrongCutPercentage(),
      negativePercent: this.getNegativeSelfTalkPercentage(),
      ending: this.getEnding()
    };
  }
}

const gameState = new GameState();

export default gameState;