import React from "react";
import { Input } from "@/components/ui";
import { DartGame } from "@/DartGame/DartGame";

interface SimplifiedInputTabProps {
  simplifiedScore: number | null;
  gameEnded: boolean;
  handleInputChange: (value: string) => void;
}

const SimplifiedInputTab: React.FC<SimplifiedInputTabProps> = ({
  simplifiedScore,
  gameEnded,
  handleInputChange,
}) => {
  return (
    <div>
      <h2 className="text-l font-bold tracking-tighter">
        Total des fléchettes
      </h2>
      <Input
        placeholder="Entrer le score"
        disabled={gameEnded}
        className="py-6"
        type="number"
        max={DartGame.MAX_SCORE_PER_ROUND}
        min={0}
        value={simplifiedScore || ""}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  );
};

export default SimplifiedInputTab;
