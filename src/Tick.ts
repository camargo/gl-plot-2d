
/**
 * Tick.
 *
 * This class represents a tick that gl-plot2d uses.
 *
 * @export
 * @class Tick
 */
export class Tick {
  public x: number;
  public text: string;

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
