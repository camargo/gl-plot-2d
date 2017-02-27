
/**
 * Line.
 *
 * @export
 * @class Line
 */
export class Line {
  public color: number[];
  public fill: boolean[];
  public fillColor: number[][];
  public width: number;

  /**
   * Creates an instance of Line.
   *
   * @param {number[]} color
   * @param {boolean[]} fill
   * @param {number[][]} fillColor
   * @param {number} width
   *
   * @memberOf Line
   */
  constructor(color: number[], fill: boolean[], fillColor: number[][], width: number) {
    this.color = color;
    this.fill = fill;
    this.fillColor = fillColor;
    this.width = width;
  }
}
