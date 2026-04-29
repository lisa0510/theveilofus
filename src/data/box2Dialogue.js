export const box2Data = {
  introDialogue: [
    {
      text: "Doktor, hier ist die zweite Box."
    },
    {
      text: "Bitte machen Sie weiter."
    }
  ],

  fishDialogue: [
    {
      text: "Du bist noch hier.",
      choices: [
        {
          id: "stay_focused",
          text: "Ich muss mich konzentrieren.",
          nextText: "Ja. Konzentrier dich."
        },
        {
          id: "feel_watched",
          text: "Ich fühle mich beobachtet.",
          nextText: "Vielleicht wirst du das."
        }
      ]
    }
  ],

  successDialogue: [
    {
      text: "Sehr gut."
    },
    {
      text: "Nur noch eine Box."
    }
  ],

  parasiteDialogue: [
    {
      text: "Schon wieder kein perfektes Ergebnis."
    },
    {
      text: "Woran lag es diesmal?",
      choices: [
        {
          id: "pressure",
          text: "Der Druck wird zu gross.",
          nextText: "Dann werde besser."
        },
        {
          id: "angry",
          text: "Hör auf damit!",
          nextText: "Ich bin nur ehrlich."
        }
      ],
      ignoreDialogue: [
        {
          text: "Du schweigst wieder. Interessant."
        }
      ]
    }
  ]
};