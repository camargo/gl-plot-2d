
import { Point } from './';

/**
 * PointPair.
 *
 * @export
 * @class PointPair
 */
export class PointPair {
  public p1: Point;
  public p2: Point;

  /**
   * Creates an instance of PointPair.
   *
   * @param {Point} p1
   * @param {Point} p2
   *
   * @memberOf PointPair
   */
  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
}
