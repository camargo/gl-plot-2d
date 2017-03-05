
/**
 * ScatterFancy.
 *
 * See https://github.com/gl-vis/gl-scatter2d-sdf.
 *
 * Adds additional selected[] property that gl-scatter2d-sdf
 * does not manage.
 *
 * @export
 * @class ScatterFancy
 */
export class ScatterFancy {
  public positions: number[];
  public sizes: number[];
  public colors: number[];
  public glyphs: string[];
  public borderWidths: number[];
  public borderColors: number[];
  public selected: boolean[];

  /**
   * Creates an instance of ScatterFancy.
   *
   * @param {number[]} positions
   * @param {number[]} sizes
   * @param {number[]} colors
   * @param {string[]} glyphs
   * @param {number[]} borderWidths
   * @param {number[]} borderColors
   * @param {boolean[]} selected
   *
   * @memberOf ScatterFancy
   */
  constructor(positions: number[],
              sizes: number[],
              colors: number[],
              glyphs: string[],
              borderWidths: number[],
              borderColors: number[],
              selected: boolean[]) {
    this.positions = positions;
    this.sizes = sizes;
    this.colors = colors;
    this.glyphs = glyphs;
    this.borderWidths = borderWidths;
    this.borderColors = borderColors;
    this.selected = selected;
  }

  /**
   * Selects a point by changing it's color.
   *
   * @param {number} pointId
   * @param {number[]} color
   *
   * @memberOf ScatterFancy
   */
  public selectByPointId(pointId: number, color: number[]) {
    const offset = pointId * 4;

    this.selected[offset] = !this.selected[offset];

    if (color.length === 4) {
      if (this.selected[offset]) {
        this.colors[offset] = color[0];
        this.colors[offset + 1] = color[1];
        this.colors[offset + 2] = color[2];
        this.colors[offset + 3] = color[3];
      }
      else {
        this.colors[offset] = 0.0;
        this.colors[offset + 1] = 0.0;
        this.colors[offset + 2] = 0.0;
        this.colors[offset + 3] = 1.0;
      }
    }
    else {
      console.error('ScatterFancy: updateColorByPointId: color array length should be 4: ', color);
    }
  }
}
