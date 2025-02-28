import { DartGame } from "@/DartGame/DartGame";
import React from "react";

interface OverflowProps {
  game: DartGame;
  totalNewPoints: number;
}

export const Overflow: React.FC<OverflowProps> = ({ game, totalNewPoints }) => {
  const currentPoints = game.getCurrentPlayer().points;
  const remainingPoints = DartGame.MAX_SCORE - currentPoints - totalNewPoints;
  const scoreOverMax = remainingPoints < 0;

  return (
    <h4
      className={`text-2xl font-bold tracking-tighter mt-4 ${
        scoreOverMax ? "text-red-500" : ""
      }`}
    >
      {currentPoints} points,{" "}
      {scoreOverMax
        ? `Annulé dépassement de ${Math.abs(remainingPoints)} points`
        : `${remainingPoints} restants`}
    </h4>
  );
};
