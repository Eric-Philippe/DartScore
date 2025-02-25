import { Player } from "./Player";

const DART_GAME_REGEX = /DartGame\(d:(\d+),r:(\d+),pi:(\d+),p:\[(.*)\]\)/;

/**
 * Main Dart Game class
 * @param players - players in the game
 * @param startDate - start date
 * @param currentRound - current round
 * @param currentPlayerIndex - current player index
 */
export class DartGame {
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
    if (players.length === 0) {
      throw new Error("At least one player is required");
    }

    if (
      currentPlayerIndex >= players.length ||
      currentPlayerIndex < 0 ||
      currentRound < 0
    ) {
      throw new Error("Invalid game state");
    }

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
   * Get the start time hour:minute
   * @returns start time
   */
  getStartTime(): string {
    const date = new Date(this.startDate);
    const minutes = date.getMinutes().toString();
    const hours = date.getHours().toString();

    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }

  /**
   * Next player, add one round if all players played
   * @returns next player
   */
  nextPlayer(): Player {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.players.length) {
      this.currentPlayerIndex = 0;
      this.currentRound++;
    }

    this.save();

    return this.getCurrentPlayer();
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
    const decodedString = atob(encoded);
    const utf8Decoder = new TextDecoder();
    const decodedBytes = new Uint8Array(
      [...decodedString].map((char) => char.charCodeAt(0))
    );
    const decoded = utf8Decoder.decode(decodedBytes);

    if (!DART_GAME_REGEX.test(decoded)) this.error();

    const matches = decoded.match(DART_GAME_REGEX);

    if (!matches) {
      throw new Error("Invalid encoded string");
    }

    const startDate = parseInt(matches[1]);
    const currentRound = parseInt(matches[2]);
    const currentPlayerIndex = parseInt(matches[3]);
    const players = matches[4].split("),").map((playerString) => {
      return Player.decodeFromString(playerString + ")");
    });

    players.sort((a, b) => a.getId() - b.getId());

    return new DartGame(players, startDate, currentRound, currentPlayerIndex);
  }

  static error() {
    localStorage.removeItem("game");
    localStorage.setItem("error", "Invalid game state");
    window.location.href = "/";
  }
}
