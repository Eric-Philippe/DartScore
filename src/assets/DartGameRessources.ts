export const DARTS_EMOTES = ["🎯", "🍺", "📌", "🔫", "💯", "🪖"];

export const MULTIPLIER = [
  {
    value: "single",
    label: "(x1)",
    badge: "Simple",
    secondary: "Reste du cercle",
    multiplier: 1,
  },
  {
    value: "double",
    label: "(x2)",
    badge: "Double",
    secondary: "Cercle Intérieur",
    multiplier: 2,
  },
  {
    value: "triple",
    label: "(x3)",
    badge: "Triple",
    secondary: "Cercle Extérieur",
    multiplier: 3,
  },
];

export const POINTS = [
  {
    illustration: "./darts_simple.gif",
    label: "Les zones simples",
    description: "La valeur du nombre est égale à : x1",
    example: "Donc si votre fléchette tombe sur le 20, vous gagnez 20 points",
  },
  {
    illustration: "./darts_double.gif",
    label: "Les zones doubles",
    description: "La valeur du nombre est égale à : x2",
    example: "Donc si votre fléchette tombe sur le 20, vous gagnez 40 points",
  },
  {
    illustration: "./darts_triple.gif",
    label: "Les zones triples",
    description: "La valeur du nombre est égale à : x3",
    example: "Donc si votre fléchette tombe sur le 20, vous gagnez 60 points",
  },
  {
    illustration: "./darts_middle_green.gif",
    label: "Le centre vert de la cible",
    description: "Le centre vert de la cible est égal à 25 points",
    example: "Donc si votre fléchette tombe sur le 25, vous gagnez 25 points",
  },
  {
    illustration: "./darts_middle_red.gif",
    label: "Le centre rouge de la cible",
    description: "Le centre rouge de la cible est égal à 50 points",
    example: "Donc si votre fléchette tombe sur le 50, vous gagnez 50 points",
  },
];

export const multiplierToNumber = (multiplier: string) => {
  switch (multiplier) {
    case "single":
      return 1;
    case "double":
      return 2;
    case "triple":
      return 3;
    default:
      return 1;
  }
};

export const getMedal = (index: number) => {
  switch (index) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return `${index + 1}.`;
  }
};
