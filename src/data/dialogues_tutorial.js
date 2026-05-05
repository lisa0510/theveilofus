const dialogues = {
  tutorial: {
    intro: [
      {
        speaker: "coworker",
        text: "Assistent: Morgen Dr. ! Bevor wir die tägliche Lieferung aus den Tiefsee-Netzen bearbeiten, hab ich hier eine Test-Box für dich. Wir müssen sicherstellen, dass der Laser richtig eingestellt ist."
      },
      {
        speaker: "coworker",
        text: "Assistent: Ich habe dein Interface bereits mit dem Bioscanner synchronisiert. Der Scanner erkennt die essbaren Stellen automatisch. Achte auf die Anzeige. Wenn dort zum Beispiel 27 % steht, schneide mit dem Laser genau 27% vom Fisch ab."
      }
    ],

    feedback: {
      perfect: "Assistent: Sehr Gut. Lassen Sie mich diesen zu den anderen Wissenschaftlern bringen.",
      okay: "Assistent: Versuchen Sie es beim nächsten Mal besser zu machen Dr.",
      bad: "Assistent: Der erste versuch des Tages ist immer der schwierigste nicht war?"
    }
  },
};

export default dialogues;