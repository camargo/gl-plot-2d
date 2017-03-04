import { Line, Point, Scatter, ScatterFancy } from './';

/**
 * Trace.
 *
 * A trace represents the data points being graphed.
 *
 * @export
 * @class Trace
 */
export class Trace {
  public mode: string;
  public positions: number[];
  public min: Point;
  public max: Point;
  public line: Line | null;
  public scatter: Scatter | null;
  public scatterFancy: ScatterFancy | null;

  /**
   * Creates an instance of Trace.
   *
   * @param {string} mode
   * @param {number[]} positions
   * @param {Point} min
   * @param {Point} max
   * @param {(Line | null)} line
   * @param {(Scatter | null)} scatter
   * @param {(ScatterFancy | null)} scatterFancy
   *
   * @memberOf Trace
   */
  constructor(mode: string,
              positions: number[],
              min: Point,
              max: Point,
              line: Line | null,
              scatter: Scatter | null,
              scatterFancy: ScatterFancy | null) {
    this.mode = mode;
    this.positions = positions;
    this.min = min;
    this.max = max;

    if (line) {
      this.line = new Line(line.color, line.fill, line.fillColor, line.width);
    }
    else {
      this.line = null;
    }

    if (scatter) {
      this.scatter = new Scatter(scatter.size, scatter.color, scatter.borderSize, scatter.borderColor);
    }
    else {
      this.scatter = null;
    }

    if (scatterFancy) {
      this.scatterFancy = new ScatterFancy(scatterFancy.sizes,
                                           scatterFancy.colors,
                                           scatterFancy.glyphs,
                                           scatterFancy.borderWidths,
                                           scatterFancy.borderColors);
    }
    else {
      this.scatterFancy = null;
    }
  }
}
