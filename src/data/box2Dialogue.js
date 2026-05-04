export const box2Data = {
  introDialogue: [
    {
      text: "Assistent: Hier ist deine zweite Box!"
    }
  ],

  successDialogue: [
    {
      text: "Assistent: Ich sehe es schon heute gibt es ein Festmahl für uns alle! Die von der Küche werden eine Menge zu tun haben."
    },
  ],

  parasiteDialogue: [
    {
      text: "Ich kann es nicht glauben wie viele Fehler du dir getraust zu machen, wärend die anderen darauf warten, dass wir gute Arbeit leisten."
    },
    {
      text: "Assistent: Mich kann es nicht glauben wie viele Fehler du dir getraust zu machen, wärend die anderen darauf warten, dass wir gute Arbeit leisten.",
      choices: [
        {
          id: "pressure",
          text: "Ich gebe mein bestes",
          nextText: "Dein Bestes ist nicht gut genug. Menschen verhungern, du fauler Sack, gibt dir Mühe!"
        },
        {
          id: "wiedergutmachen",
          text: "Was soll ich denn machen?",
          nextText: "Einen verdammten Knopf drücken, ist das so schwer? Du musst ja sonst nichts machen."
        }
      ],
      ignoreDialogue: [
        {
          text: "Assistent: Mich zu ignorieren löst nicht deine Probleme."
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
    { text: "Hey ist alles okay? Du siehst so bleich aus, du solltest dich für heute ausruhen." },
    { text: "Ich weiss, nicht viele deiner Fische konnten wir für den Verzehr behalten, aber mach dir nichts draus.  Dann muss ich halt wieder früher in die Säure, das gehört nun mal zu unserem jetzigen Leben." }
  ],

  ending2: [
    { text: "Unglaublich, du hast du viele Fische für uns als Nahrung behalten können! Team MoKla, hat es wieder super hinbekommen!" },
    { text: "Keine Sorge, ich erwarte nicht dass dies jetzt zur Normalität wird haha " }
  ],

  ending3: [
    { text: "Von all den Menschen die es geschafft haben sich unter Wasser zu retten, musste ich mit der unnützen Person in ein Team gesteckt werden." }
  ],

  ending4: [
    { text: "Die Leistung dieses Mal war in Ordnung, besser sogar als letztes Mal. Denk jedoch nicht, dass dies heisst dass du dich nicht noch weiter anstrengen musst." },
    { text: "Ich erwarte, dass du eines Tages Perfektion erreicht verstanden?" }
  ],

  endingNeutral: [
    { text: "Das Ergebnis ist unklar." },
    { text: "Nicht gut. Nicht schlecht." },
    { text: "Nur ein weiterer Tag unter Wasser." }
  ]
}

};