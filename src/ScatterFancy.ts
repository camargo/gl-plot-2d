
/**
 * ScatterFancy.
 *
 * See https://github.com/gl-vis/gl-scatter2d-sdf.
 *
 * @export
 * @class ScatterFancy
 */
export class ScatterFancy {
  public sizes: number[];
  public colors: number[];
  public glyphs: string[];
  public borderWidths: number[];
  public borderColors: number[];

  /**
   * Creates an instance of ScatterFancy.
   *
   * @param {number[]} sizes
   * @param {number[]} colors
   * @param {string[]} glyphs
   * @param {number[]} borderWidths
   * @param {number[]} borderColors
   *
   * @memberOf ScatterFancy
   */
  constructor(sizes: number[], colors: number[], glyphs: string[], borderWidths: number[], borderColors: number[]) {
    this.sizes = sizes;
    this.colors = colors;
    this.glyphs = glyphs;
    this.borderWidths = borderWidths;
    this.borderColors = borderColors;
  }

  /**
   * Updates colors array to a given color via a pointId.
   *
   * @param {number} pointId
   * @param {number[]} color
   *
   * @memberOf ScatterFancy
   */
  public updateColorByPointId(pointId: number, color: number[]) {
    const offset = pointId * 4;

    if (color.length === 4) {
      this.colors[offset] = color[0];
      this.colors[offset + 1] = color[1];
      this.colors[offset + 2] = color[2];
      this.colors[offset + 3] = color[3];
    }
    else {
      console.error('ScatterFancy: updateColorByPointId: color array length should be 4: ', color);
    }
  }
}
