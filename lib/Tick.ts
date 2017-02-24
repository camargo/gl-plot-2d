
/**
 * Tick.
 *
 * @export
 * @class Tick
 */
export class Tick {
  x: number;
  text: string;

  /**
   * Creates an instance of Tick.
   *
   * @param {number} x
   * @param {string} text
   *
   * @memberOf Tick
   */
  constructor(x: number) {
    this.x = x;
    this.text = x.toString();
  }
}
