
/**
 * Line.
 *
 * See https://github.com/gl-vis/gl-line2d.
 *
 * @export
 * @class Line
 */
export class Line {
  public positions: number[];
  public color: number[];
  public fill: boolean[];
  public fillColor: number[][];
  public width: number;

  /**
   * Creates an instance of Line.
   *
   * @param {number[]} positions
   * @param {number[]} color
   * @param {boolean[]} fill
   * @param {number[][]} fillColor
   * @param {number} width
   *
   * @memberOf Line
   */
  constructor(positions: number[], color: number[], fill: boolean[], fillColor: number[][], width: number) {
    this.positions = positions;
    this.color = color;
    this.fill = fill;
    this.fillColor = fillColor;
    this.width = width;
  }
}
