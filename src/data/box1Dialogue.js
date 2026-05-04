export const box1Data = {
  introDialogue: [
    {
      text: "Da bin ich wieder Doktor.."
    }
  ],

  successDialogue: [
    { text: "Assistent: Perfekt! Wenn das so weiter geht, ist unser Lager im Hand um drehen gefüllt, voller leckeren Fisch." },
    { text: "Assistent: Hier ist deine zweite Box!" }
  ],

  parasiteDialogue: [
    {
      text: "Klara: Macht es dir spass zu zusehen, wie die anderen Taucherinnen und ich unser Leben draussen riskieren oder wieso bedienst du den Laser nicht korrekt?"
    },
    {
      text: "Klara: Macht es dir spass zu zusehen, wie die anderen Taucherinnen und ich unser Leben draussen riskieren oder wieso bedienst du den Laser nicht korrekt?",
      choices: [
        {
          id: "learned",
          text: "Ich bin halt noch nicht geübt..",
          nextText: "Assistent: Wie dumm kannst du sein? Es sind jetzt schon 7 Monate her, seit wir hier angekommen sind und du hast immer noch nicht gelernt, deinen Job richtig zu machen."
        },
        {
          id: "dontcare",
          text: "Assistent würde nie so etwas sagen...",
          nextText: "Assistent: Sagen nicht, aber denken schon. Wenn sie nicht gezwungen wäre mit dir in einer Gruppe zu sein, hätte sie dich schon lange für jemand bessern verlassen."
        }
      ],

      ignoreDialogue: [
        { text: "Na gut, dann Antworte halt nicht..." },
      ]
    }
  ]
};