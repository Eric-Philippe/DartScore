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
