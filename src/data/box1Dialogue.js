export const box1Data = {
  introDialogue: [
    {
      text: "Da bin ich wieder Doktor, hier ist die erste Box von drei, für Sie."
    },
  ],

  fishDialogue: [
    {
      text: "Auf einen erfolgreichen Arbeitstag."
    },
    {
      text: "Gut gemacht! Zum Glück ist SIE nicht hier, Sie hätte dein Resultat bestimmt schlecht geredet.",
      choices: [
        {
          text: "Ich hätte SIE fast vergessen.",
          nextText: "....Oh. Tut mir leid ich hätte dich nicht an SIE erinnern sollen. Ignorier mein geblubbere einfach."
        },
        {
          text: "Stimmt SIE gibt es noch.",
          nextText: "....Oh. Tut mir leid ich hätte dich nicht an SIE erinnern sollen. Ignorier mein geblubbere einfach."
        }
      ]
    }
  ],

  whaleDialogue: [
    {
      text: "Hörst du das, es war ein enttäuschendes Resultat. Habe ich dich nicht besser gelernt?"
    },
    {
      text: "Wie fühlst du dich?",
      choices: [
        {
          text: "Ich lerne daraus.",
          nextText: "Gut."
        },
        {
          text: "War mir egal.",
          nextText: "Das sehe ich."
        }
      ]
    }
  ]
};