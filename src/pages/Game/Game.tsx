import { Component } from "react";
import Confetti from "react-confetti";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AlertCircle } from "lucide-react";

import {
  getMedal,
  MULTIPLIER,
  multiplierToNumber,
  POINTS,
} from "@/assets/DartGameRessources";
import { DartGame } from "@/DartGame/DartGame";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const MAX_SCORE = DartGame.MAX_SCORE;

interface GameProps {
  game: DartGame;
}

interface GameState {
  scores: number[];
  multipliers: string[];
  validated: boolean;
  simplifiedScore: number | null;
  gameEnded: boolean;
}

class Game extends Component<GameProps, GameState> {
  game = this.props.game;
  totalNewPoints = 0;

  constructor(props: GameProps) {
    super(props);
    this.state = {
      scores: [0, 0, 0],
      multipliers: ["single", "single", "single"],
      validated: false,
      simplifiedScore: null,
      gameEnded: false,
    };
  }

  handleInputChange = (value: string, index?: number) => {
    if (isNaN(parseInt(value))) {
      value = "0";
    }

    if (index != null) {
      this.setState({ simplifiedScore: null });

      if (parseInt(value) > 25 || parseInt(value) < 0) {
        value = "0";
      }

      const scores = [...this.state.scores];
      scores[index] = parseInt(value);

      this.updatePoints(scores, [...this.state.multipliers]);

      this.setState({ scores });
    } else {
      this.setState({ scores: [0, 0, 0] });
      this.setState({ multipliers: ["single", "single", "single"] });

      if (parseInt(value) > 180 || parseInt(value) < 0) {
        value = "0";
      }

      this.setState({ simplifiedScore: parseInt(value) });

      this.updatePoints(
        [parseInt(value), 0, 0],
        ["single", "single", "single"]
      );
    }
  };

  handleSelectChange = (index: number, value: string) => {
    const multipliers = [...this.state.multipliers];
    multipliers[index] = value;

    this.updatePoints([...this.state.scores], multipliers);

    this.setState({ multipliers });
    if (this.state.simplifiedScore) {
      this.setState({ simplifiedScore: null });
    }
  };

  updatePoints = (scores: number[], multipliers: string[]) => {
    this.totalNewPoints = 0;
    scores.forEach((score, index) => {
      this.totalNewPoints += score * multiplierToNumber(multipliers[index]);
    });
  };

  handleSubmit = () => {
    if (this.state.simplifiedScore) {
      this.totalNewPoints = this.state.simplifiedScore;
    }

    if (
      this.game.getCurrentPlayer().points + this.totalNewPoints <=
      MAX_SCORE
    ) {
      this.game.getCurrentPlayer().addPoints(this.totalNewPoints);
    }

    if (this.game.getCurrentPlayer().getPoints() == MAX_SCORE) {
      this.setState({ gameEnded: true });
    } else {
      this.game.nextPlayer();
    }

    this.setState({
      scores: [0, 0, 0],
      multipliers: ["single", "single", "single"],
      validated: true,
      simplifiedScore: 0,
    });
    this.totalNewPoints = 0;

    setTimeout(() => {
      this.setState({ validated: false });
    }, 3000);
  };

  stop() {
    this.game.stop();
    window.location.reload();
  }

  restart() {
    this.game.restart();
    window.location.reload();
  }

  render() {
    const advisedMoves = DartGame.adviseMoove(
      this.game.getCurrentPlayer().getPoints() + this.totalNewPoints
    );

    return (
      <>
        {this.state.gameEnded && <Confetti />}
        <div className="p-4">
          <Breadcrumb>
            <BreadcrumbList>
              {this.game.getPlayersFromCurrent().map((player) => (
                <>
                  <BreadcrumbItem key={player.getId()}>
                    {this.game.isCurrentPlayer(player) ? (
                      <BreadcrumbPage>{player.getName()}</BreadcrumbPage>
                    ) : (
                      player.getName()
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              ))}
              <BreadcrumbItem key="etc">...</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 p-4 ml-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter mt-6">
                Au tour de {this.game.getCurrentPlayer().getName()}
              </h1>

              <h4
                className={`text-2xl font-bold tracking-tighter mt-4 ${
                  MAX_SCORE -
                    this.game.getCurrentPlayer().points -
                    this.totalNewPoints <
                  0
                    ? "text-red-500"
                    : ""
                }`}
              >
                {this.game.getCurrentPlayer().points} points,{" "}
                {MAX_SCORE -
                  this.game.getCurrentPlayer().points -
                  this.totalNewPoints <
                0
                  ? `Annulé dépassement de ${Math.abs(
                      MAX_SCORE -
                        this.game.getCurrentPlayer().points -
                        this.totalNewPoints
                    )} points`
                  : `${
                      MAX_SCORE -
                      this.game.getCurrentPlayer().points -
                      this.totalNewPoints
                    } restants`}
              </h4>

              {advisedMoves.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mt-4">
                      {`Terminable avec : ${advisedMoves[0]}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 max-h-64 overflow-y-auto">
                    {advisedMoves.slice(0, 50).map((moove, index) => (
                      <div key={moove} className="flex items-center space-x-4">
                        <Badge>{index + 1}</Badge>
                        <p className="text-l">{moove}</p>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              )}

              <h6 className="text-l font-bold tracking-tighter mt-4">
                {this.totalNewPoints} points à ajouter
              </h6>
            </div>

            <Tabs defaultValue="detailed" className="w-2/3 mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="detailed">Détaillé</TabsTrigger>
                <TabsTrigger value="simplified">Simplifié</TabsTrigger>
              </TabsList>
              <TabsContent value="detailed">
                <div>
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="mb-4">
                      <h2 className="text-l font-bold tracking-tighter">
                        Fléchette {index + 1} -
                      </h2>
                      <div className="flex items-center space-x-4">
                        <div className="w-3/4">
                          <Label className="mt-4">Score</Label>
                          <Input
                            className="py-6"
                            placeholder="Entrer le score"
                            value={
                              this.state.scores[index] != 0
                                ? this.state.scores[index]
                                : ""
                            }
                            type="number"
                            max={25}
                            min={0}
                            onChange={(e) =>
                              this.handleInputChange(e.target.value, index)
                            }
                          />
                        </div>
                        <div>
                          <Label className="mt-4">Multiplicateur</Label>
                          <Select
                            value={this.state.multipliers[index] as string}
                            onValueChange={(value) =>
                              this.handleSelectChange(index, value)
                            }
                          >
                            <SelectTrigger className="py-6">
                              <SelectValue placeholder="Sélectionner la zone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Multiplicateur</SelectLabel>
                                {MULTIPLIER.map((multiplier) => (
                                  <SelectItem
                                    key={multiplier.value}
                                    value={multiplier.value}
                                  >
                                    <Badge>{multiplier.badge}</Badge>

                                    {multiplier.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Separator className="my-3" />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="simplified">
                <div>
                  <h2 className="text-l font-bold tracking-tighter">
                    Total des fléchettes
                  </h2>
                  <Input
                    placeholder="Entrer le score"
                    className="py-6"
                    type="number"
                    max={180}
                    min={0}
                    value={this.state.simplifiedScore || ""}
                    onChange={(e) => this.handleInputChange(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="w-2/3 p-4 mt-6">
            {this.state.validated && (
              <Alert variant="default" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Prochain round</AlertTitle>
                <AlertDescription>
                  Les points ont été ajoutés avec succès.
                </AlertDescription>
              </Alert>
            )}
            <h3 className="text-3xl font-bold tracking-tighter">
              Partie de fléchette
            </h3>

            <h5 className="text-l font-bold tracking-tighter">
              Commencé à {this.game.getStartTime()}
            </h5>

            <h6 className="text-2xl font-bold tracking-tighter mt-4">
              Tour {this.game.getCurrentRound() + 1} -{" "}
              {this.game.getCurrentPlayerIndex() + 1} /{" "}
              {this.game.getPlayers().length}
            </h6>

            {this.state.gameEnded && (
              <h6 className="text-2xl front-bold tracking-tighter mt-4">
                {`${this.game.getCurrentPlayer().getName()} a gagné !`}
              </h6>
            )}

            <div className="mt-6">
              <Button
                className="mb-4 mr-3"
                onClick={this.handleSubmit}
                disabled={this.state.gameEnded}
              >
                Confirmer les points
              </Button>
              <Drawer direction="top">
                <DrawerTrigger asChild>
                  <Button className="mr-3" variant="outline">
                    Comment compter les points
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="p-4">
                    <div className="mx-auto w-full max-w-xl">
                      <DrawerHeader>
                        <DrawerTitle>
                          Les points de la partie de fléchette
                        </DrawerTitle>
                        <DrawerDescription>
                          Voici les différents points que vous pouvez obtenir
                          lors d'une partie de fléchette.
                        </DrawerDescription>
                      </DrawerHeader>
                    </div>
                    <div className="flex justify-center overflow-x-auto space-x-4">
                      {POINTS.map((point) => (
                        <Card key={point.label} className="mb-4 w-58">
                          <CardHeader>
                            <CardTitle>{point.label}</CardTitle>
                          </CardHeader>
                          <CardContent className="px-4">
                            <div className="w-full h-32 sm:h-24 flex items-center justify-center">
                              <img
                                src={point.illustration}
                                alt={point.label}
                                className="object-contain h-full"
                              />
                            </div>
                          </CardContent>
                          <CardFooter>
                            <p className="text-center break-words">
                              {point.description}
                            </p>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Fermer</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <div>
                <Button
                  className="mr-4"
                  variant="secondary"
                  onClick={() => this.restart()}
                >
                  Recommencer la partie
                </Button>
                <Button variant="destructive" onClick={() => this.stop()}>
                  Arrêter la partie
                </Button>
              </div>
            </div>

            <div className="mt-6 mr-3 w-10/12">
              <h3 className="text-2xl font-bold tracking-tighter mb-4">
                Classement
              </h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Place</th>
                    <th className="py-2">Joueur</th>
                    <th className="py-2">Points gagnés</th>
                    <th className="py-2">Points restants</th>
                    <th className="py-2">Actions conseillées</th>
                  </tr>
                </thead>
                <tbody>
                  {this.game.getPlayersByScore().map((player, index) => (
                    <tr key={player.getId()}>
                      <td className="border px-4 py-2">{getMedal(index)}</td>
                      <td className="border px-4 py-2">{player.getName()}</td>
                      <td className="border px-4 py-2">{player.points}</td>
                      <td className="border px-4 py-2">
                        {MAX_SCORE - player.points}
                      </td>
                      <td className="border px-4 py-2">
                        {DartGame.adviseMoove(player.points).length > 0
                          ? DartGame.adviseMoove(player.points)[0]
                          : "Aucun"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Game;
