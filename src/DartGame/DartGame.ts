import { Player } from "./Player";

/** Regex to match the encoded string */
const DART_GAME_REGEX = /DartGame\(d:(\d+),r:(\d+),pi:(\d+),p:\[(.*)\]\)/;

/**
 * Main Dart Game class, can fit inside a single string
 * @param players - players in the game
 * @param startDate - start date
 * @param currentRound - current round
 * @param currentPlayerIndex - current player index
 */
export class DartGame {
  static MAX_SCORE = 501;
  static MAX_SCORE_PER_ROUND = 180;

  private players: Player[] = [];
  private startDate;
  private currentRound;
  private currentPlayerIndex;

  /**
   * Dart Game constructor
   * @param players - players in the game
   * @param startDate - start date
   * @param currentRound - current round, default 0
   * @param currentPlayerIndex - current player index, default 0
   */
  constructor(
    players: Player[],
    startDate: number,
    currentRound = 0,
    currentPlayerIndex = 0
  ) {
    if (players.length === 0)
      throw new Error("At least one player is required");

    if (
      currentPlayerIndex >= players.length ||
      currentPlayerIndex < 0 ||
      currentRound < 0
    )
      throw new Error("Invalid game state");

    this.startDate = startDate;
    this.currentRound = currentRound;
    this.currentPlayerIndex = currentPlayerIndex;

    this.players = players;
    this.players.sort((a, b) => a.getId() - b.getId());
  }

  /**
   * Start the game
   * Save the game state to local storage
   */
  start() {
    localStorage.setItem("game", this.encodeToString());
  }

  /**
   * Save the game state to local storage
   */
  save() {
    localStorage.setItem("game", this.encodeToString());
  }

  /**
   * Stop the game
   * Remove the game state from local storage
   */
  stop() {
    localStorage.removeItem("game");
  }

  /**
   * Restart the game
   * Keep the players and start a new game
   */
  restart() {
    this.currentRound = 0;
    this.currentPlayerIndex = 0;
    this.players.forEach((player) => player.setPoints(0));
    this.players.forEach((player) => player.generateNewId());
    this.players.sort((a, b) => a.getId() - b.getId());
    this.save();
  }

  /**
   * Error method
   * Remove the game state from local storage
   * Redirect to the home page with an error message
   */
  static error() {
    localStorage.removeItem("game");
    localStorage.setItem("error", "Invalid game state");
    window.location.href = "/";
  }

  /**
   * Method to know if the game is ended
   * @returns true if one of the players has reached the max score
   */
  isGameEnded(): boolean {
    return this.players.some(
      (player) => player.getPoints() === DartGame.MAX_SCORE
    );
  }

  /**
   * Method to know if the given player is the current player
   * @param player - player to check
   * @returns true if the player is the current player
   */
  isCurrentPlayer(player: Player): boolean {
    return this.getCurrentPlayer().getId() === player.getId();
  }

  /**
   * Get the start time hour:minute
   * @returns start time
   */
  getStartTime(): string {
    const date = new Date(this.startDate);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  /**
   * Get current round
   * @returns current round
   */
  getCurrentRound(): number {
    return this.currentRound;
  }

  /**
   * Get current player index
   * @returns current player index
   */
  getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }

  /**
   * Get players array
   * @returns players array
   */
  getPlayers(): Player[] {
    return this.players.sort((a, b) => a.getId() - b.getId());
  }

  /**
   * Get players by score
   * @returns players array
   */
  getPlayersByScore(): Player[] {
    const newPlayers = [...this.players]; // Create a copy of the players array
    newPlayers.sort((a, b) => b.getPoints() - a.getPoints());
    return newPlayers;
  }

  /**
   * Get the player list from the current player as the first player
   * @returns players array
   */
  getPlayersFromCurrent(): Player[] {
    const players = [...this.players];
    return players
      .slice(this.currentPlayerIndex)
      .concat(this.players.slice(0, this.currentPlayerIndex));
  }

  /**
   * Get players count
   * @returns players count
   */
  getPlayersLength(): number {
    return this.players.length;
  }

  /**
   * Get current player
   * @returns current player
   */
  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  /**
   * Next player, add one round if all players played
   * @returns next player
   */
  nextPlayer(): Player {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
    if (this.currentPlayerIndex === 0) this.currentRound++;
    this.save();
    return this.getCurrentPlayer();
  }

  /**
   * Encode the class to string
   * DartGame(r:0,pi:0,p:[Player(i:373051,n:John,p:0),Player(i:676584,n:Doe,p:0)])
   * Where r is current round, pi is current player index, p is players array, d is start date
   * [Player(i:373051,d:28822882,n:John,p:0),Player(i:676584,n:Doe,p:0)]
   * Where i is player id, n is player name, p is player points
   * @returns - encoded string
   */
  encodeToString(): string {
    const encodedString =
      "DartGame(" +
      `d:${this.startDate},` +
      `r:${this.currentRound},` +
      `pi:${this.currentPlayerIndex},` +
      `p:[${this.players.map((player) => player.encodeToString())}]` +
      ")";

    const utf8Encoder = new TextEncoder();
    const encodedBytes = utf8Encoder.encode(encodedString);
    return btoa(String.fromCharCode(...encodedBytes));
  }

  /**
   * Decode the string and build the class
   * @param encoded - encoded string
   * @returns - DartGame instance
   */
  static decodeFromString(encoded: string): DartGame {
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
    );
    if (!DART_GAME_REGEX.test(decoded)) this.error();

    const matches = decoded.match(DART_GAME_REGEX);
    if (!matches) throw new Error("Invalid encoded string");

    const [, startDate, currentRound, currentPlayerIndex, playersStr] = matches;
    const players = playersStr
      .split("),")
      .map((s) => Player.decodeFromString(s + ")"))
      .sort((a, b) => a.getId() - b.getId());

    return new DartGame(
      players,
      parseInt(startDate),
      parseInt(currentRound),
      parseInt(currentPlayerIndex)
    );
  }

  /**
   * If the player has less than 170 points remaining, advise the best move
   * The best move must end on the last arrow on a double
   * We will prefer a move with a bigger first arrows and a smaller to score the last arrow
   *
   * Ex: 170 left : (T20) + (T20) + (D25) = 170
   * Ex: 141 left : (T20) + (T19) + (D12) = 141
   */
  static adviseMoove(points: number): string[] {
    const remainingScore = this.MAX_SCORE - points;
    if (remainingScore > 170) return [];

    const singles = Array.from({ length: 20 }, (_, i) => i + 1).concat(25);
    const doubles = singles.map((n) => n * 2);
    const triples = singles.slice(0, -1).map((n) => n * 3);
    const bestMooves: string[] = [];

    const addMoove = (prefix: string, score: number) => {
      doubles.forEach((d) => {
        if (score + d === remainingScore)
          bestMooves.push(`${prefix} D${d / 2}`);
      });
    };

    addMoove("", 0);
    singles.forEach((s) => addMoove(`S${s}`, s));
    triples.forEach((t) => addMoove(`T${t / 3}`, t));
    singles.forEach((s1) =>
      singles.forEach((s2) => addMoove(`S${s1} S${s2}`, s1 + s2))
    );
    singles.forEach((s) =>
      triples.forEach((t) => addMoove(`S${s} T${t / 3}`, s + t))
    );
    triples.forEach((t1) =>
      triples.forEach((t2) => addMoove(`T${t1 / 3} T${t2 / 3}`, t1 + t2))
    );
    triples.forEach((t) =>
      singles.forEach((s) => addMoove(`T${t / 3} S${s}`, t + s))
    );

    bestMooves.sort((a, b) => {
      // Compare by the number of elements after splitting with " "
      const aParts = a.split(" ");
      const bParts = b.split(" ");
      const partsDifference = aParts.length - bParts.length;

      if (partsDifference !== 0) {
        return partsDifference;
      }

      // Compare by the combined weight of actions
      const getWeight = (part: string) => {
        if (part.startsWith("S")) return 1;
        if (part.startsWith("D")) return 2;
        if (part.startsWith("T")) return 3;
        return 0;
      };

      const aWeight = aParts.reduce((sum, part) => sum + getWeight(part), 0);
      const bWeight = bParts.reduce((sum, part) => sum + getWeight(part), 0);
      const weightDifference = aWeight - bWeight;

      if (weightDifference !== 0) {
        return weightDifference;
      }

      // If the number of elements and combined weight are the same, compare by the last "D" value
      const elA = aParts.pop() as string;
      const elB = bParts.pop() as string;

      return parseInt(elA.split("D")[1]) - parseInt(elB.split("D")[1]);
    });

    return bestMooves;
  }
}
