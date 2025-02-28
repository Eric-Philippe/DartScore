import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui";
import { DartGame } from "@/DartGame/DartGame";

interface BreadcrumbPlayersProps {
  game: DartGame;
}

export const BreadcrumbPlayers: React.FC<BreadcrumbPlayersProps> = ({
  game,
}) => {
  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          {game.getPlayersFromCurrent().map((player) => (
            <React.Fragment key={player.getId()}>
              <BreadcrumbItem key={player.getId()}>
                {game.isCurrentPlayer(player) ? (
                  <BreadcrumbPage>{player.getName()}</BreadcrumbPage>
                ) : (
                  player.getName()
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
          <BreadcrumbItem key="etc">...</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
