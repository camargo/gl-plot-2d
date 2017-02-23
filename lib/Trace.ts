
import { Line, Scatter } from './';

/**
 * Trace.
 *
 * @export
 * @class Trace
 */
export class Trace {
  public mode: string;
  public positions: Float32Array;
  public positionCount: number;
  public line: Line | null;
  public scatter: Scatter | null;

  /**
   * Creates an instance of Trace.
   *
   * @param {string} mode
   * @param {Float32Array} positions
   * @param {Line} line
   * @param {Scatter} scatter
   *
   * @memberOf Trace
   */
  constructor(mode: string,
              positions: Float32Array,
              positionCount: number,
              line ?: Line,
              scatter ?: Scatter) {
    this.mode = mode;
    this.positions = positions;
    this.positionCount = positionCount;

    if (line) {
      this.line = new Line(line.fill, line.fillColor, line.width);
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
  }
}
