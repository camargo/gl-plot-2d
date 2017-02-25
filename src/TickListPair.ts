
import { Tick } from './';

/**
 * TickListPair.
 *
 * @export
 * @class TickListPair
 */
export class TickListPair {
  public t1: Tick[];
  public t2: Tick[];

  /**
   * Creates an instance of TickListPair.
   *
   * @param {Tick[]} t1
   * @param {Tick[]} t2
   *
   * @memberOf TickListPair
   */
  constructor(t1: Tick[], t2: Tick[]) {
    this.t1 = t1;
    this.t2 = t2;
  }
}
