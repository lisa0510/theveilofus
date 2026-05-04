export const box1Data = {
  introDialogue: [
    {
      text: "Da bin ich wieder Doktor.."
    }
  ],

  successDialogue: [
    { text: "Danke" },
    { text: "Box 2 wartet bereits." }
  ],

  parasiteDialogue: [
    {
      text: "Hörst du das, es war ein enttäuschendes Resultat. Habe ich dich nicht besser gelernt?"
    },
    {
      text: "Hörst du das, es war ein enttäuschendes Resultat. Habe ich dich nicht besser gelernt?",
      choices: [
        {
          id: "learned",
          text: "Ich habe mein Bestes gegeben.",
          nextText: "Sicher? Ohne mich schaffst du es nicht Meister deiner Fähigkeit zu werden, dass wünscht du dir doch so sehr."
        },
        {
          id: "dontcare",
          text: "Lass mich in Ruhe!",
          nextText: "Nur Personen mit Stamina, schaffen es zur Meisterschaft. Dir fehlt die Willenskraft solch eine Person zu sein."
        }
      ],

      ignoreDialogue: [
        { text: "Na gut, dann Antworte halt nicht.Doch vergiss nicht, du brauchst mich um Perfektion zu erlangen!" },
      ]
    }
  ]
};