import { Tick } from './';

/**
 * GlPlot2dOptions.
 *
 * These are options for the gl-plot2d library.
 *
 * For an explanation of each option see:
 * https://github.com/gl-vis/gl-plot2d/blob/master/README.md
 *
 * @export
 * @interface GlPlot2dOptions
 */
export interface GlPlot2dOptions {
  // General.
  gl: WebGLRenderingContext;
  pixelRatio: number;
  screenBox: number[] | null;
  dataBox: number[] | null;
  viewBox: number[] | null;

  // Title.
  titleEnable: boolean;
  title: string;
  titleCenter: number[];
  titleAngle: number;
  titleColor: number[];
  titleFont: string;
  titleSize: number;

  // Background color.
  backgroundColor: number[];

  // Border.
  borderColor: number[];
  borderLineEnable: boolean[];
  borderLineWidth: number[];
  borderLineColor: number[][];

  // Labels.
  labels: string[];
  labelEnable: boolean[];
  labelAngle: number[];
  labelPad: number[];
  labelSize: number[];
  labelFont: string[];
  labelColor: number[][];

  // Ticks.
  ticks: Tick[][];
  tickEnable: boolean[];
  tickPad: number[];
  tickAngle: number[];
  tickColor: number[][];
  tickMarkWidth: number[];
  tickMarkLength: number[];
  tickMarkColor: number[][];

  // Grid lines.
  gridLineEnable: boolean[];
  gridLineColor: number[][];
  gridLineWidth: number[];

  // Zero lines.
  zeroLineEnable: boolean[];
  zeroLineColor: number[][];
  zeroLineWidth: number[];
}
