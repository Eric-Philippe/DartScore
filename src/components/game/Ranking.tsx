import React from "react";

import { getMedal } from "@/assets/DartGameRessources";
import { DartGame } from "@/DartGame/DartGame";

interface RankingProps {
  game: DartGame;
}

export const Ranking: React.FC<RankingProps> = ({ game }) => {
  return (
    <div className="mt-6 mr-3 mb-6 w-10/12">
      <h3 className="text-2xl font-bold tracking-tighter mb-4">Classement</h3>
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
          {game.getPlayersByScore().map((player, index) => (
            <tr key={player.getId()}>
              <td className="border px-4 py-2">{getMedal(index)}</td>
              <td className="border px-4 py-2">{player.getName()}</td>
              <td className="border px-4 py-2">{player.points}</td>
              <td className="border px-4 py-2">
                {DartGame.MAX_SCORE - player.points}
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
  );
};
