
/**
 * Line.
 *
 * @export
 * @class Line
 */
export class Line {
  public fill: boolean[];
  public fillColor: number[][];
  public width: number;

  /**
   * Creates an instance of Line.
   *
   * @param {boolean[]} fill
   * @param {number[][]} fillColor
   * @param {number} width
   *
   * @memberOf Line
   */
  constructor(fill: boolean[], fillColor: number[][], width: number) {
    this.fill = fill;
    this.fillColor = fillColor;
    this.width = width;
  }
}
