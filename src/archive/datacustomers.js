const datacustomers = [
  {
    id: "karl",
    name: "Karl",
    image: "karl",
    order: "Black Coffee",
    dialogue: "Guten Morgen, mir gehts heute nicht so gut. Ich hätte gerne einen schwarzen Kaffee, bitte.",
    choices: [
      {
        text: "Oh, tut mir leid zu hören. Was ist denn los?",
        customerReply: "yapyap"
      },
      {
        text: "Ich habe keine Zeit für das",
        customerReply: "(murmelt) will sie nicht wissen, was los ist? frech"
      }
    ],
    reaction: "Danke, das ist genau das, was ich brauche."
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