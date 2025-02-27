const PLAYER_REGEX = /Player\(i:(\d+),n:(.*),p:(\d+)\)/;

/**
 * Dart Player class
 * @param id - player id
 * @param name - player name
 * @param points - player points
 */
export class Player {
  id: number = 0;
  name: string = "";
  points: number = 0;

  /**
   * Constructor
   * @param id - player id
   * @param name - player name
   * @param points - player points
   */
  constructor(id: number, name: string, points?: number) {
    this.id = id;
    this.name = name;
    if (points) this.points = points;
  }

  /**
   * Add points to the player
   * @param points - points to add
   * @returns points
   */
  addPoints(points: number): number {
    this.points += points;
    return this.points;
  }

  /**
   * Add points to the player
   * @param points - points to add
   * @returns points
   */
  addPointsWithoutMultiplier(points: number): number {
    this.points += points;
    return this.points;
  }

  /**
   * Get the player's points
   * @returns points
   */
  getPoints(): number {
    return this.points;
  }

  /**
   * Set the player's points
   * @param points - points
   */
  setPoints(points: number): void {
    this.points = points;
  }

  /**
   * Get the player's name
   * @returns name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the player's id
   * @returns id
   */
  getId(): number {
    return this.id;
  }

  /**
   * Return player informations
   * @returns player informations
   */
  toString(): string {
    return `Player ${this.name} has ${this.points} points`;
  }

  /**
   * Encode the class to string
   * Player(i:373051,n:John,p:0)
   * Where i is player id, n is player name, p is player points
   * @returns - encoded string
   */
  encodeToString(): string {
    return (
      `Player(` + `i:${this.id},` + `n:${this.name},` + `p:${this.points})`
    );
  }

  /**
   * Decode the string and build the class
   * @param encoded - encoded string
   * @returns - Player instance
   */
  static decodeFromString(encoded: string): Player {
    const match = encoded.match(PLAYER_REGEX);
    if (!match) {
      throw new Error("Invalid player string");
    }

    return new Player(parseInt(match[1]), match[2], parseInt(match[3]));
  }
}
