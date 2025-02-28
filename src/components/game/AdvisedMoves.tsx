import React from "react";
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "../ui";
import { DartGame } from "@/DartGame/DartGame";

const MAX_ADVICE = 50;

interface AdvisedMovesProps {
  game: DartGame;
  totalNewPoints: number;
}

export const AdvisedMoves: React.FC<AdvisedMovesProps> = ({
  game,
  totalNewPoints,
}) => {
  const advisedMoves = DartGame.adviseMoove(
    game.getCurrentPlayer().getPoints() + totalNewPoints
  );

  return (
    <>
      {advisedMoves.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="mt-4">
              {`Terminable avec : ${advisedMoves[0]}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-64 overflow-y-auto">
            {advisedMoves.slice(0, MAX_ADVICE).map((moove, index) => (
              <div key={moove} className="flex items-center space-x-4">
                <Badge>{index + 1}</Badge>
                <p className="text-l">{moove}</p>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
