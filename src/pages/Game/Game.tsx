import { Component } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AlertCircle } from "lucide-react";

import {
  getMedal,
  MULTIPLIER,
  multiplierToNumber,
} from "@/assets/DartGameRessources";
import { DartGame } from "@/DartGame/DartGame";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface GameProps {
  game: DartGame;
}

interface GameState {
  scores: number[];
  multipliers: string[];
  validated: boolean;
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
    };
  }

  handleInputChange = (index: number, value: string) => {
    if (isNaN(parseInt(value))) {
      value = "0";
    }

    if (parseInt(value) > 50 || parseInt(value) < 0) {
      value = "0";
    }

    const scores = [...this.state.scores];
    scores[index] = parseInt(value);

    this.updatePoints(scores, [...this.state.multipliers]);

    this.setState({ scores });
  };

  handleSelectChange = (index: number, value: string) => {
    const multipliers = [...this.state.multipliers];
    multipliers[index] = value;

    this.updatePoints([...this.state.scores], multipliers);

    this.setState({ multipliers });
  };

  updatePoints = (scores: number[], multipliers: string[]) => {
    this.totalNewPoints = 0;
    scores.forEach((score, index) => {
      this.totalNewPoints += score * multiplierToNumber(multipliers[index]);
    });
  };

  handleSubmit = () => {
    this.game.getCurrentPlayer().addPoints(this.totalNewPoints);
    this.game.nextPlayer();
    this.setState({
      scores: [0, 0, 0],
      multipliers: ["single", "single", "single"],
      validated: true,
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

  render() {
    return (
      <div className="flex">
        <div className="w-2/3 p-4">
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

          <div>
            <h1 className="text-4xl font-bold tracking-tighter mt-6">
              Au tour de {this.game.getCurrentPlayer().getName()}
            </h1>

            <h4 className="text-2xl font-bold tracking-tighter mt-4">
              {this.game.getCurrentPlayer().points} points,{" "}
              {501 - this.game.getCurrentPlayer().points} restants
            </h4>

            <h6 className="text-l font-bold tracking-tighter mt-4">
              {this.totalNewPoints} points à ajouter
            </h6>
          </div>

          <div className="w-2/3 mt-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="mb-4">
                <h2 className="text-l font-bold tracking-tighter">
                  Fléchette {index + 1} -
                </h2>
                <Input
                  placeholder="Entrer le score"
                  value={
                    this.state.scores[index] != 0
                      ? this.state.scores[index]
                      : ""
                  }
                  type="number"
                  max={50}
                  min={0}
                  onChange={(e) =>
                    this.handleInputChange(index, e.target.value)
                  }
                />

                <Label className="mt-4">Multiplicateur</Label>
                <Select
                  value={this.state.multipliers[index] as string}
                  onValueChange={(value) =>
                    this.handleSelectChange(index, value)
                  }
                >
                  <SelectTrigger>
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
                          <Badge variant="secondary">
                            {multiplier.secondary}
                          </Badge>
                          {multiplier.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Separator className="my-3" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 p-4 mt-6">
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

          <div className="mt-6">
            <Button className="mb-4 mr-5" onClick={this.handleSubmit}>
              Confirmer les points
            </Button>
            <Button variant="secondary" onClick={() => this.stop()}>
              Arrêter la partie
            </Button>
          </div>

          <div className="mt-6 mr-3">
            <h3 className="text-2xl font-bold tracking-tighter mb-4">
              Classement
            </h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">Place</th>
                  <th className="py-2">Joueur</th>
                  <th className="py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {this.game.getPlayersByScore().map((player, index) => (
                  <tr key={player.getId()}>
                    <td className="border px-4 py-2">{getMedal(index)}</td>
                    <td className="border px-4 py-2">{player.getName()}</td>
                    <td className="border px-4 py-2">{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
