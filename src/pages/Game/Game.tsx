import React from "react";
import Confetti from "react-confetti";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
} from "@/components/ui";
import { Ranking } from "@/components/game/Ranking";
import { AlertSubmit } from "@/components/game/AlertSubmit";
import { BreadcrumbPlayers } from "@/components/game/BreadcrumbPlayers";
import DetailedInputTab from "@/components/game/DetailedInputTab";
import SimplifiedInputTab from "@/components/game/SimplifiedInputTab";
import { Overflow } from "@/components/game/Overflow";
import { AdvisedMoves } from "@/components/game/AdvisedMoves";
import { Tuto } from "@/components/game/Tuto";

import { multiplierToNumber } from "@/assets/DartGameRessources";
import { DartGame } from "@/DartGame/DartGame";
import { ValidationButton } from "@/components/ValidationButton";

const NOTIF_DURATION = 2000;
const EMPTY_ARRAY = [0, 0, 0];
const SINGLE_ARRAY = ["single", "single", "single"];

interface GameProps {
  game: DartGame;
}

export const Game: React.FC<GameProps> = ({ game }) => {
  const [totalNewPoints, setTotalNewPoints] = React.useState(0);
  const [scores, setScores] = React.useState(EMPTY_ARRAY);
  const [multipliers, setMultipliers] = React.useState(SINGLE_ARRAY);
  const [validated, setValidated] = React.useState(false);
  const [simplifiedScore, setSimplifiedScore] = React.useState<number | null>(
    null
  );
  const [gameEnded, setGameEnded] = React.useState(false);

  const handleInputChange = (value: string, index?: number) => {
    let parsedValue = parseInt(value);

    if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;

    if (index != null) {
      setSimplifiedScore(null);

      if (parsedValue > 25) {
        parsedValue = 0;
      }

      scores[index] = parsedValue;
      setScores([...scores]);

      updatePoints(scores, multipliers);
    } else {
      if (parsedValue > DartGame.MAX_SCORE_PER_ROUND) parsedValue = 0;

      setScores(EMPTY_ARRAY);
      setMultipliers(SINGLE_ARRAY);
      setSimplifiedScore(parsedValue);

      updatePoints(parsedValue, SINGLE_ARRAY);
    }
  };

  const handleSelectChange = (index: number, value: string) => {
    const new_multipliers = [...multipliers];
    new_multipliers[index] = value;

    updatePoints([...scores], new_multipliers);

    setMultipliers(new_multipliers);
    setSimplifiedScore(null);
  };

  const updatePoints = (scores: number[] | number, multipliers: string[]) => {
    setTotalNewPoints(0);
    if (typeof scores === "number") setTotalNewPoints(scores);
    else {
      for (let i = 0; i < scores.length; i++) {
        setTotalNewPoints((prev) => {
          return prev + scores[i] * multiplierToNumber(multipliers[i]);
        });
      }
    }
  };

  const handleSubmit = () => {
    const currentPlayer = game.getCurrentPlayer();
    const newPoints = simplifiedScore || totalNewPoints;

    if (currentPlayer.points + newPoints <= DartGame.MAX_SCORE) {
      currentPlayer.addPoints(newPoints);
    }

    if (currentPlayer.getPoints() === DartGame.MAX_SCORE) {
      setGameEnded(true);
      game.save();
    } else {
      game.nextPlayer();
    }

    setScores(EMPTY_ARRAY);
    setMultipliers(SINGLE_ARRAY);
    setValidated(true);
    setSimplifiedScore(0);
    setTotalNewPoints(0);

    setTimeout(() => {
      setValidated(false);
    }, NOTIF_DURATION);
  };

  const stop = () => {
    game.stop();
    window.location.reload();
  };

  const restart = () => {
    game.restart();
    window.location.reload();
  };
  return (
    <>
      {gameEnded && <Confetti />}
      <BreadcrumbPlayers game={game} />

      <div className="flex flex-col md:flex-row -mt-8" id="game-container">
        <div className="w-full md:w-2/3 p-4 ml-0 md:ml-6" id="inputs-container">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mt-6">
              Au tour de {game.getCurrentPlayer().getName()}
            </h1>

            <Overflow game={game} totalNewPoints={totalNewPoints} />

            <AdvisedMoves game={game} totalNewPoints={totalNewPoints} />

            <h6 className="text-l font-bold tracking-tighter mt-4">
              {totalNewPoints} points à ajouter
            </h6>
          </div>

          <Tabs defaultValue="detailed" className="w-full md:w-2/3 mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detailed">Détaillé</TabsTrigger>
              <TabsTrigger value="simplified">Simplifié</TabsTrigger>
            </TabsList>
            <TabsContent value="detailed">
              <DetailedInputTab
                scores={scores}
                multipliers={multipliers}
                gameEnded={gameEnded}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
              />
            </TabsContent>
            <TabsContent value="simplified">
              <SimplifiedInputTab
                simplifiedScore={simplifiedScore}
                gameEnded={gameEnded}
                handleInputChange={handleInputChange}
              />
            </TabsContent>
            <div className="block md:hidden mt-4">
              <Button
                className="mb-4 mr-3"
                onClick={handleSubmit}
                disabled={gameEnded}
              >
                Confirmer les points
              </Button>
            </div>
          </Tabs>
        </div>

        <div className="w-full md:w-2/3 p-4 mt-6" id="game-container">
          {validated && <AlertSubmit />}

          <h3 className="text-3xl font-bold tracking-tighter">
            Partie de fléchette
          </h3>

          <h5 className="text-l font-bold tracking-tighter">
            Commencé à {game.getStartTime()}
          </h5>

          <h6 className="text-2xl font-bold tracking-tighter mt-4">
            Tour {game.getCurrentRound() + 1} -{" "}
            {game.getCurrentPlayerIndex() + 1} / {game.getPlayers().length}
          </h6>

          {gameEnded && (
            <h6 className="text-2xl front-bold tracking-tighter mt-4">
              {`${game.getCurrentPlayer().getName()} a gagné !`}
            </h6>
          )}

          <div className="mt-6">
            <div className="hidden md:block">
              <Button
                className="mb-4 mr-3"
                onClick={handleSubmit}
                disabled={gameEnded}
              >
                Confirmer les points
              </Button>

              <Tuto />
            </div>

            <div>
              <ValidationButton
                className="mr-4"
                buttonVariant="secondary"
                buttonText="Recommencer la partie"
                validationText="Voulez-vous vraiment recommencer la partie ?"
                onClick={() => restart()}
              />
              <ValidationButton
                buttonVariant="destructive"
                buttonText="Arrêter la partie"
                validationText="Voulez-vous vraiment arrêter la partie ?"
                onClick={() => stop()}
              />
            </div>
          </div>

          <Ranking game={game} />
        </div>
      </div>
    </>
  );
};

export default Game;
