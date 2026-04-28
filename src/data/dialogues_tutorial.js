const dialogues = {
  tutorial: {
    intro: [
      {
        speaker: "coworker",
        text: "Guten Morgen Dr. Wenn Sie diese probe Fische geschnitten haben, bringe ich Ihnen die Boxen für den heutigen Arbeitstag."
      },
      {
        speaker: "coworker",
        text: "Merken Sie, die Forschungsabteilung hat darum gebeten, das alle Spezimen heute bei ungefähr 50% durchgeschnitten werden müssen."
      }
    ],

    fishIntro: [
      {
        speaker: "fish",
        text: "Viel Glück und vergiss nicht, Fehler passieren, mach einfach das beste draus."
      }
    ],
    feedback: {
      perfect: "Perfekt vielen Dank, lassen Sie mich diesen zu den anderen Wissenschaftlern bringen.",
      okay: "Das ist in Ordnung, aber versuchen Sie es beim nächsten Mal besser zu machen Dr.",
      bad: "Der erste versuch des Tages ist immer der schwierigste nicht war? Lassen Sie mich den Weg bringen."
    }
  },

  box1: {
    coworkerIntro: [
      {
        speaker: "coworker",
        text: "Hier ist Box Nummer eins."
      },
      {
        speaker: "coworker",
        text: "Vier Spezimen. Schneiden Sie sauber."
      }
    ],

    fishIntro: [
      {
        speaker: "fish",
        text: "Schon wieder ein Mensch mit einem Messer..."
      }
    ]
  }
};

export default dialogues;