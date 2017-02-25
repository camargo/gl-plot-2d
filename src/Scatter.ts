
/**
 * Scatter.
 *
 * @export
 * @class Scatter
 */
export class Scatter {
  public size: number;
  public color: number[];
  public borderSize: number;
  public borderColor: number[];

  /**
   * Creates an instance of Scatter.
   *
   * @param {number} size
   * @param {number[]} color
   * @param {number} borderSize
   * @param {number[]} borderColor
   *
   * @memberOf Scatter
   */
  constructor(size: number, color: number[], borderSize: number, borderColor: number[]) {
    this.size = size;
    this.color = color;
    this.borderSize = borderSize;
    this.borderColor = borderColor;
  }
}
