const datacustomers = [
  {
    id: "elizabeth",
    name: "Elizabeth",
    image: "elizabeth",
    order: "Black Coffee",
    dialogue: "Hi love, It's been hell of a day. My husband got fired and I dont know how to please him properly. Maybe a black coffee could help him calm down?",
    choices: [
      {
        text: "I dont care about your husband.",
        customerReply: "Oh... right. Just make the coffee, please."
      },
      {
        text: "Oh sorry my dear.",
        customerReply: "Thank you. That's really sweet of you."
      }
    ],
    reaction: "Thanks for the coffee."
  },
  {
    id: "lukarde",
    name: "Lukarde",
    image: "lukarde",
    order: "Cafe au lait",
    dialogue: "I'd like a cafe au lait, please.",
    choices: [
      {
        text: "You again?",
        customerReply: "I just want my coffee."
      },
      {
        text: "Of course, coming right up.",
        customerReply: "Appreciate it."
      }
    ],
    reaction: "That is really nice. Thanks!"
  },
  {
    id: "laura",
    name: "Laura",
    image: "laura",
    order: "Cold Brew",
    dialogue: "Get me a cold brew ASAP!!!",
    choices: [
      {
        text: "No need to be rude.",
        customerReply: "You're right. Sorry."
      },
      {
        text: "Sure, I'll make it quickly.",
        customerReply: "Thanks. I appreciate it."
      }
    ],
    reaction: "Finally. I didnt mean to be so rude, but I was really in a hurry."
  },
  {
    id: "klara",
    name: "Klara",
    image: "klara",
    order: "Latte",
    dialogue: "I'll have a latte, please.",
    choices: [
      {
        text: "Alright.",
        customerReply: "Thank you."
      },
      {
        text: "You look tired.",
        customerReply: "I am, actually. It's been a long day."
      }
    ],
    reaction: "Delicious! Thank you."
  }
];

export default datacustomers;