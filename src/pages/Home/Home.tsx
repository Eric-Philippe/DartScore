import React, { Component } from "react";

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

interface HomeState {
  players: InputPlayer[];
}

class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    const error = localStorage.getItem("error");
    if (error) {
      localStorage.removeItem("error");
    }
  }

  generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  state: HomeState = {
    players: [{ id: this.generateRandomId(), name: "" }],
  };

  areNamesValid = () => {
    return this.state.players.every((player) => player.name !== "");
  };

  addPlayer = () => {
    this.setState((prevState) => {
      if (prevState.players.length < 8) {
        return {
          players: [
            ...prevState.players,
            { id: this.generateRandomId(), name: "" },
          ],
        };
      }
      return prevState;
    });
  };

  removePlayer = (id: number) => {
    this.setState((prevState) => {
      if (prevState.players.length > 1) {
        return {
          players: prevState.players.filter((player) => player.id !== id),
        };
      }
      return prevState;
    });
  };

  handleNameChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPlayers = this.state.players.map((player) => {
      if (player.id === id) {
        return { ...player, name: event.target.value };
      }
      return player;
    });
    this.setState({ players: newPlayers });
  };

  createNewGame = () => {
    const players = this.state.players.map((player, index) => {
      return new Player(player.id, DARTS_EMOTES[index] + " " + player.name);
    });
    const newGame = new DartGame(players, new Date().getTime());
    newGame.start();
    this.props.setDartGame(newGame);
  };

  render() {
    return (
      <div className="home-container">
        <div className="background"></div>
        <div className="central-container">
          {this.props.error && (
            <div className="error-message">Une erreur est survenue</div>
          )}
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
                  {this.state.players.map((player, index) => (
                    <Card key={player.id} className="mb-4 mx-4">
                      <CardHeader>
                        <CardTitle>
                          Joueur {index + 1} {DARTS_EMOTES[index]}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          value={player.name}
                          onChange={(e) => this.handleNameChange(player.id, e)}
                          placeholder={`Nom`}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => this.removePlayer(player.id)}
                        >
                          Supprimer
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                  <Button onClick={this.addPlayer}>+</Button>
                </div>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerFooter>
                    {this.state.players.length < 6 && (
                      <Button onClick={this.addPlayer}>
                        Ajouter un joueur
                      </Button>
                    )}
                    <Button
                      disabled={!this.areNamesValid()}
                      onClick={this.createNewGame}
                    >
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
  }
}

export default Home;
