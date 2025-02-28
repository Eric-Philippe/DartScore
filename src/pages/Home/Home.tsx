import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Player } from "@/DartGame/Player";
import { DartGame } from "@/DartGame/DartGame";

import "./Home.css";
import { DARTS_EMOTES } from "@/assets/DartGameRessources";

interface InputPlayer {
  id: number;
  name: string;
}

interface HomeProps {
  setDartGame: (game: DartGame) => void;
  error?: string | null;
}

const generateRandomId = () => {
  return Math.floor(Math.random() * 10000);
};

export const Home: React.FC<HomeProps> = ({ setDartGame, error }) => {
  const [players, setPlayers] = useState<InputPlayer[]>([
    { id: generateRandomId(), name: "" },
  ]);

  if (error) {
    localStorage.removeItem("error");
  }

  const areNamesValid = () => {
    return players.every((player) => player.name !== "");
  };

  const addPlayer = () => {
    setPlayers([...players, { id: generateRandomId(), name: "" }]);
  };

  const removePlayer = (id: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const handleNameChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlayers(
      players.map((player) => {
        if (player.id === id) {
          return { ...player, name: event.target.value };
        }
        return player;
      })
    );
  };

  const createNewGame = () => {
    const _players = players.map((player, index) => {
      return new Player(player.id, DARTS_EMOTES[index] + " " + player.name);
    });
    const newGame = new DartGame(_players, new Date().getTime());
    newGame.start();
    setDartGame(newGame);
  };

  return (
    <div className="home-container">
      <div className="background"></div>
      <div className="central-container">
        {error && <div className="error-message">Une erreur est survenue</div>}
        <h1 className="text-6xl font-bold tracking-tighter">Dart Score</h1>
        <h2 className="text-4xl font-bold tracking-tighter">🎯</h2>

        <Drawer direction="top">
          <DrawerTrigger asChild>
            <Button className="start-button">
              Commencer une partie de fléchette
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Ajouter des participants:</DrawerTitle>
                  <DrawerDescription>
                    Rajouter des joueurs à l'aide du bouton ci-dessous
                  </DrawerDescription>
                </DrawerHeader>
              </div>
              <div className="mx-auto max-w-sm flex justify-center">
                {players.map((player, index) => (
                  <Card key={player.id} className="mb-4 mx-4">
                    <CardHeader>
                      <CardTitle>
                        Joueur {index + 1} {DARTS_EMOTES[index]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        value={player.name}
                        onChange={(e) => handleNameChange(player.id, e)}
                        placeholder={`Nom`}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        onClick={() => removePlayer(player.id)}
                      >
                        Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Button onClick={addPlayer}>+</Button>
              </div>
              <div className="mx-auto w-full max-w-sm">
                <DrawerFooter>
                  {players.length < 6 && (
                    <Button onClick={addPlayer}>Ajouter un joueur</Button>
                  )}
                  <Button disabled={!areNamesValid()} onClick={createNewGame}>
                    Commencer
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Annuler</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Home;
