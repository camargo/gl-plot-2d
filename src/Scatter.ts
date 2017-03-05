
/**
 * Scatter.
 *
 * See https://github.com/gl-vis/gl-scatter2d.
 *
 * @export
 * @class Scatter
 */
export class Scatter {
  public positions: number[];
  public size: number;
  public color: number[];
  public borderSize: number;
  public borderColor: number[];

  /**
   * Creates an instance of Scatter.
   *
   * @param {number[]} positions
   * @param {number} size
   * @param {number[]} color
   * @param {number} borderSize
   * @param {number[]} borderColor
   *
   * @memberOf Scatter
   */
  constructor(positions: number[], size: number, color: number[], borderSize: number, borderColor: number[]) {
    this.positions = positions;
    this.size = size;
    this.color = color;
    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }
}
