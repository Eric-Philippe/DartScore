import Home from "./pages/Home/Home";

import { useState } from "react";
import { DartGame } from "./DartGame/DartGame";
import Game from "./pages/Game/Game";

function App() {
  const [game, setGame] = useState<DartGame | null>(null);

  const error = localStorage.getItem("error");

  if (!game) {
    const gameString = localStorage.getItem("game");
    if (gameString) {
      const game = DartGame.decodeFromString(gameString);
      setGame(game);
    }
  }

  return (
    <>
      {game ? (
        <Game game={game} />
      ) : (
        <Home setDartGame={setGame} error={error} />
      )}
    </>
  );
}

export default App;
