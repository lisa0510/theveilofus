export const box2Data = {
  introDialogue: [
    {
      text: "Hallo Dr, hier ist die zweite Box!"
    }
  ],

  fishDialogue: [
    {
      text: "Du bist noch hier...Was wohl der Wal dazu meint?",
      choices: [
        {
          id: "stay_focused",
          text: "Ich bin hier um zu arbeiten.",
          nextText: "Oh...Ich dachte schon du würdest dich von mir ablenken lassen..."
        },
        {
          id: "feel_watched",
          text: "Ich fühle mich beobachtet.",
          nextText: "Vielleicht wirst du das..."
        }
      ]
    }
  ],

  successDialogue: [
    {
      text: "Lass mich das zu den anderen Wissenschaftlern bringen."
    },
  ],

  parasiteDialogue: [
    {
      text: "Schon wieder kein perfektes Ergebnis."
    },
    {
      text: "Mich zu enttäuschen ist eine Sache, aber jetzt leidet dein ganzes Team unter dir.",
      choices: [
        {
          id: "pressure",
          text: "Menschen machen Fehler",
          nextText: "Menschen ohne Ziele im Leben, machen Fehler. Ich dachte du bist ein Mensch mit Vision."
        },
        {
          id: "wiedergutmachen",
          text: "Wie kann ich das wieder gut machen?",
          nextText: "Wenn du aufhörst so faul zu sein und jede Sekunde übst... schaffst du es vielleicht ein akzeptables Level zu errreichen."
        }
      ],
      ignoreDialogue: [
        {
          text: "Mich zu ignorieren löst nicht deine Probleme."
        }
      ]
    }
  ],

preEndingDialogue: {
  ending1: [
    { text: "Das war alles für heute." },
    { text: "Endign 1 text hier..." }
  ],

  ending2: [
    { text: "Das war alles für heute." },
    { text: "2" }
  ],

  ending3: [
    { text: "Das war alles für heute." },
    { text: "3." }
  ],

  ending4: [
    { text: "Das war alles für heute." },
    { text: "4" }
  ]
},

finalDialogues: {
  ending1: [
    { text: "Du hast viele Fehler gemacht." },
    { text: "Und jedes Mal hast du dich selbst weiter nach unten gezogen." },
    { text: "Die Station wird still." }
  ],

  ending2: [
    { text: "Die Ergebnisse waren fehlerhaft." },
    { text: "Aber du hast dich nicht vollständig gegen dich selbst gewendet." },
    { text: "Vielleicht bleibt etwas von dir übrig." }
  ],

  ending3: [
    { text: "Deine Schnitte waren präzise." },
    { text: "Doch in deinem Kopf warst du grausamer zu dir als nötig." },
    { text: "Perfektion hat ihren Preis." }
  ],

  ending4: [
    { text: "Die Proben wurden sauber vorbereitet." },
    { text: "Du bist ruhig geblieben." },
    { text: "Für einen Moment wirkt die Tiefe weniger feindlich." }
  ],

  endingNeutral: [
    { text: "Das Ergebnis ist unklar." },
    { text: "Nicht gut. Nicht schlecht." },
    { text: "Nur ein weiterer Tag unter Wasser." }
  ]
}

};