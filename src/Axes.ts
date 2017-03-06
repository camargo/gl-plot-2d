import { Tick } from './';

/**
 * Axes.
 *
 * @export
 * @class Axes
 */
export class Axes {
  public x: Tick[];
  public y: Tick[];

  /**
   * Creates an instance of Axes.
   *
   * @param {Tick[]} x
   * @param {Tick[]} y
   *
   * @memberOf Axes
   */
  constructor(x: Tick[], y: Tick[]) {
    this.x = x;
    this.y = y;
  }
}
