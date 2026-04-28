export const box1Data = {
  introDialogue: [
    {
      text: "Da bin ich wieder Doktor. Hier ist die erste Box von drei."
    },
    {
      text: "Bitte kümmern Sie sich darum."
    }
  ],

  fishDialogue: [
    {
      text: "Zum Glück ist SIE nicht hier.",
      choices: [
        {
          id: "remember_her",
          text: "Ich hätte SIE fast vergessen.",
          nextText:
            "....Oh. Tut mir leid. Ich hätte dich nicht erinnern sollen."
        },
        {
          id: "she_exists",
          text: "Stimmt. SIE gibt es noch.",
          nextText:
            "....Oh. Tut mir leid. Ignorier mein Geblubber."
        }
      ]
    }
  ],

  successDialogue: [
    {
      text: "Oh good."
    },
    {
      text: "Box 2 wartet bereits."
    }
  ],

  whaleDialogue: [
    {
      text: "Hörst du das? Das war enttäuschend."
    },
    {
      text: "Wie fühlst du dich?",
      choices: [
        {
          id: "learned",
          text: "Ich lerne daraus.",
          nextText: "Gut."
        },
        {
          id: "dontcare",
          text: "War mir egal.",
          nextText: "Das sehe ich."
        }
      ]
    }
  ]
};